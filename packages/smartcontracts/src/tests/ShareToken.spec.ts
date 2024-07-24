import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

import { MarbleLsdV1, ShareToken } from "../generated";
import {
  deployContracts,
  MarbleLsdDeploymentResult,
} from "./testUtils/deployment";
import { toWei } from "./testUtils/mathUtils";

describe("ShareToken", () => {
  let proxyMarbleLsd: MarbleLsdV1;
  let accounts: SignerWithAddress[] = [];
  let shareToken: ShareToken;

  before(async () => {
    const fixture: MarbleLsdDeploymentResult =
      await loadFixture(deployContracts);
    proxyMarbleLsd = fixture.proxyMarbleLsd;
    shareToken = fixture.shareToken;
    accounts = await ethers.getSigners();
  });

  it("Should have owner address as marbleProxy address", async () => {
    const owner = await shareToken.owner();
    expect(owner).to.equal(await proxyMarbleLsd.getAddress());
  });

  it("Should not able to mint token other than owner address", async () => {
    const signer = accounts[5];
    await expect(
      shareToken.connect(signer).mint(signer.address, toWei("10")),
    ).to.be.revertedWith("Ownable: caller is not the owner");
  });

  it("Should not able to burn token other than owner address", async () => {
    const signer = accounts[5];
    await expect(
      shareToken.connect(signer).burn(signer.address, toWei("10")),
    ).to.be.revertedWith("Ownable: caller is not the owner");
  });
});
