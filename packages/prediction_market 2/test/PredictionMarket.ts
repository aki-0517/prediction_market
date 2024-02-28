const { expect } = require("chai");
import { ethers, network } from "hardhat";
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("PredictionMarket contract", function () {
  async function deployContractFixture() {
    const [owner, addr1, addr2] = await ethers.getSigners();
    const Contract = await ethers.getContractFactory("PredictionMarket");
    const hardhatContract = await Contract.deploy(owner);

    return { hardhatContract, owner, addr1, addr2 };
  }

  describe("Deployment", function () {
    it("Should deploy", async function () {
      const { hardhatContract, owner } = await loadFixture(
        deployContractFixture
      );
      expect(await hardhatContract.owner()).to.equal(owner.address);
    });

    it("Create Contract by owner", async function () {
      const { hardhatContract, owner } = await loadFixture(
        deployContractFixture
      );
  
      //2023/1/1 timestamp = 1672531200
      await hardhatContract.createContract("contract 0", 1672531200, 100, [1, 2, 3]);
      const contract_0 = await hardhatContract.getContract(0)

      expect(contract_0[0]).to.equal(owner.address);
      expect(contract_0[1]).to.equal("contract 0");
      expect(contract_0[2]).to.equal(1672531200);
      expect(contract_0[3][0]).to.equal(1);
      expect(contract_0[3][1]).to.equal(2);
      expect(contract_0[3][2]).to.equal(3);
      expect(contract_0[4]).to.equal(100);
      expect(contract_0[5]).to.equal(false);
      expect(contract_0[6]).to.equal(0);
    });

    it("Create Contract by not owner", async function () {
      const { hardhatContract, owner, addr1 } = await loadFixture(
        deployContractFixture
      );
  
      //2023/1/1 timestamp = 1672531200
      await expect(hardhatContract.connect(addr1).createContract("contract 0", 1672531200, 100, [1, 2, 3]))
            .to.be.revertedWithCustomError(hardhatContract, "OwnableUnauthorizedAccount")
            .withArgs(addr1.address);
    });

    it("Check buyShares", async function () {
      const { hardhatContract, owner } = await loadFixture(
        deployContractFixture
      );
  
      //2023/1/1 timestamp = 1672531200
      await hardhatContract.createContract("contract 0", 1672531200, 100, [1, 2, 3]);
      await hardhatContract.buyShares(0, 1, { value: 100 });
      
      it("when the contract has already been resolved"), async function () {
        await expect(hardhatContract.buyShares(1, 2, { value: 100 })).to.be.revertedWith("Contract has already been resolved.");
      }

      it("when checking value is not equal to the contract prise"), async function () {
        await expect(hardhatContract.buyShares(0, 1, { value: 10 })).to.be.revertedWith("Incorrect amount of cUSD sent.");
        await expect(hardhatContract.buyShares(0, 1, { value: 101 })).to.be.revertedWith("Incorrect amount of cUSD sent.");
      }

      it("when selecting invalid option"), async function () {
        await expect(hardhatContract.buyShares(0, 4, { value: 10 })).to.be.revertedWith("Invalid option selected.");
      }
    });

    it("Resolve Contract", async function () {
      const { hardhatContract, owner, addr1 } = await loadFixture(
        deployContractFixture
      );
  
      const now = Math.floor(Date.now() / 1000);
      const endTimestamp = now + 3600; // 1 hour from now
      await hardhatContract.createContract("contract 0", 1672531200, 100, [1, 2, 3]);

      await expect(hardhatContract.connect(addr1).resolveContract(0, 2))
                           .to.be.revertedWith("Only the creator can resolve the contract.");
      
      await hardhatContract.resolveContract(0, 1);
      const resolvedContract = await hardhatContract.getContract(0);
      expect(resolvedContract.resolved).to.equal(true);
      expect(resolvedContract.winningOption).to.equal(1);

      // Ensure that the contract cannot be resolved again
      await expect(hardhatContract.resolveContract(0, 2)).to.be.revertedWith("Contract has already been resolved.");
      // Check that only the creator can resolve the contract
      await expect(hardhatContract.connect(addr1).resolveContract(0, 2)).to.be.revertedWith("Only the creator can resolve the contract.");
    });

    it("Resolve Contract: should revert if trying to resolve a contract that has not yet expired", async function () {
      const { hardhatContract, owner, addr1 } = await loadFixture(
        deployContractFixture
      );
      // Create a new contract with an end timestamp in the future
      const futureTimestamp = Math.floor(Date.now() / 1000) + 7200; // 2 hours from now
      await hardhatContract.createContract("Future Contract", futureTimestamp, 100, [1, 2, 3]);
      // Attempt to resolve the contract before it has expired
      await expect(hardhatContract.resolveContract(0, 1)).to.be.revertedWith("Contract has not yet expired.");
    });

    it("Check isValidOption", async function () {
      const { hardhatContract, owner, addr1 } = await loadFixture(
        deployContractFixture
      );
      // Create a new contract with an end timestamp in the future
      const futureTimestamp = Math.floor(Date.now() / 1000) + 7200; // 2 hours from now
      await hardhatContract.createContract("Future Contract", futureTimestamp, 100, [1, 2, 3]);
      
      it("should return true for a valid option", async function () {
        expect(await hardhatContract.isValidOption(0, 1)).to.be.true;
      });
    
      it("should return false for an invalid option", async function () {
        expect(await hardhatContract.isValidOption(0, 4)).to.be.false;
      });
    });
  });
});