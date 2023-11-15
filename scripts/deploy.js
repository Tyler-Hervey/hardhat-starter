// imports
const { ethers, run, network } = require("hardhat")

// async main
async function main() {
    const SimpleStorageFactory =
        await ethers.getContractFactory("SimpleStorage")
    console.log("Deploying SimpleStorage...")
    const simpleStorage = await SimpleStorageFactory.deploy()
    console.log("SimpleStorage deployed to:", simpleStorage.target)
    // what happens if we deploy to hardhat network instead of sepolia?
    console.log(`network config: ${network.config}`)
    if (network.config.chainId === 11155111 && process.env.ETHERSCAN_API_KEY) {
        console.log("waiting for block tx")
        await simpleStorage.deploymentTransaction().wait(6)
        await verify(simpleStorage.target, [])
    }
    const currentValue = await simpleStorage.retrieve()
    console.log(`Current value stored in contract: ${currentValue}`)
    // update current value
    const transactionResponse = await simpleStorage.store(7)
    await transactionResponse.wait(1)
    const updatedValue = await simpleStorage.retrieve()

    console.log(`Updated value stored in contract: ${updatedValue}`)
}

async function verify(contractAddress, args) {
    console.log("Verifying contract...")
    try {
        await run("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
        })
    } catch (e) {
        if (e.message.toLowerCase().includes("already verified")) {
            console.log("Contract already verified")
        } else {
            console.error(e)
        }
    }
}
// main
main()
    .then(() => {
        process.exit(0)
    })
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
