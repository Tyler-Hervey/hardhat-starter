const { ethers, run, network } = require("hardhat")
const { assert } = require("chai")

describe("simpleStorage", function () {
    let SimpleStorageFactory, simpleStorage
    beforeEach(async function () {
        SimpleStorageFactory = await ethers.getContractFactory("SimpleStorage")
        simpleStorage = await SimpleStorageFactory.deploy()
    })
    it("Should start with a favorite number of 0", async function () {
        const currentValue = await simpleStorage.retrieve()
        const expectedValue = 0

        assert.equal(currentValue.toString(), expectedValue)
    })
    it("Should update the favorite number", async function () {
        const transactionResponse = await simpleStorage.store(7)
        await transactionResponse.wait(1)
        const updatedValue = await simpleStorage.retrieve()
        const expectedValue = 7

        assert.equal(updatedValue.toString(), expectedValue)
    })
    it("should return a person with a name and favorite number", async function () {
        const favoriteNumber = 7
        const name = "Bob"
        const tx = await simpleStorage.addPerson(name, favoriteNumber)
        await tx.wait(1)

        const peopleCount = await simpleStorage.peopleCount()
        const person = await simpleStorage.people(peopleCount - BigInt(1))
        console.log(person)
        assert.equal(person.name, name)
        assert.equal(
            person.favoriteNumber.toString(),
            favoriteNumber.toString(),
        )
    })
})
