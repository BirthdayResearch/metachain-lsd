import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

import { MarbleLsdV1 } from "../generated";
import {
  deployContracts,
  MarbleLsdDeploymentResult,
} from "./testUtils/deployment";

describe("MarbleLsdRoles", () => {
  let proxyMarbleLsd: MarbleLsdV1;
  let administratorSigner: SignerWithAddress;
  let defaultAdminSigner: SignerWithAddress;
  let accounts: SignerWithAddress[] = [];
  let rewardDistributerAndFinalizeSigner: SignerWithAddress;

  before(async () => {
    const fixture: MarbleLsdDeploymentResult =
      await loadFixture(deployContracts);
    proxyMarbleLsd = fixture.proxyMarbleLsd;
    administratorSigner = fixture.administratorSigner;
    defaultAdminSigner = fixture.defaultAdminSigner;
    rewardDistributerAndFinalizeSigner =
      fixture.rewardDistributerAndFinalizeSigner;
    accounts = await ethers.getSigners();
  });

  it("Should have admin role to default admin address", async () => {
    const adminRoleHash = await proxyMarbleLsd.DEFAULT_ADMIN_ROLE();
    expect(adminRoleHash).to.equal(
      "0x0000000000000000000000000000000000000000000000000000000000000000",
    );
    expect(
      await proxyMarbleLsd.hasRole(adminRoleHash, defaultAdminSigner.address),
    ).to.equal(true);
  });

  it("Should fail to grant DEFAULT_ADMIN_ROLE by non default admin address", async () => {
    const signer = accounts[5];
    const adminRoleHash = await proxyMarbleLsd.DEFAULT_ADMIN_ROLE();
    await expect(
      proxyMarbleLsd.connect(signer).grantRole(adminRoleHash, signer.address),
    ).to.be.revertedWith(
      `AccessControl: account ${signer.address.toLowerCase()} is missing role 0x${"0".repeat(
        64,
      )}`,
    );
  });

  it("Should fail to grant ADMINISTRATOR_ROLE by non default admin address", async () => {
    const signer = accounts[5];
    const administratorRoleHash = await proxyMarbleLsd.ADMINISTRATOR_ROLE();
    await expect(
      proxyMarbleLsd
        .connect(signer)
        .grantRole(administratorRoleHash, signer.address),
    ).to.be.revertedWith(
      `AccessControl: account ${signer.address.toLowerCase()} is missing role 0x${"0".repeat(
        64,
      )}`,
    );
    await expect(
      proxyMarbleLsd
        .connect(administratorSigner)
        .grantRole(administratorRoleHash, signer.address),
    ).to.be.revertedWith(
      `AccessControl: account ${administratorSigner.address.toLowerCase()} is missing role 0x${"0".repeat(
        64,
      )}`,
    );
  });

  it("Should fail to grant FINALIZE_ROLE by non default admin address", async () => {
    const signer = accounts[5];
    const finalizeRoleHash = await proxyMarbleLsd.FINALIZE_ROLE();
    await expect(
      proxyMarbleLsd
        .connect(signer)
        .grantRole(finalizeRoleHash, signer.address),
    ).to.be.revertedWith(
      `AccessControl: account ${signer.address.toLowerCase()} is missing role 0x${"0".repeat(
        64,
      )}`,
    );
    await expect(
      proxyMarbleLsd
        .connect(rewardDistributerAndFinalizeSigner)
        .grantRole(finalizeRoleHash, signer.address),
    ).to.be.revertedWith(
      `AccessControl: account ${rewardDistributerAndFinalizeSigner.address.toLowerCase()} is missing role 0x${"0".repeat(
        64,
      )}`,
    );
  });

  it("Should fail to grant REWARDS_DISTRIBUTER_ROLE by non default admin address", async () => {
    const signer = accounts[5];
    const rewardDistributerRoleHash =
      await proxyMarbleLsd.REWARDS_DISTRIBUTER_ROLE();
    await expect(
      proxyMarbleLsd
        .connect(signer)
        .grantRole(rewardDistributerRoleHash, signer.address),
    ).to.be.revertedWith(
      `AccessControl: account ${signer.address.toLowerCase()} is missing role 0x${"0".repeat(
        64,
      )}`,
    );
    await expect(
      proxyMarbleLsd
        .connect(rewardDistributerAndFinalizeSigner)
        .grantRole(rewardDistributerRoleHash, signer.address),
    ).to.be.revertedWith(
      `AccessControl: account ${rewardDistributerAndFinalizeSigner.address.toLowerCase()} is missing role 0x${"0".repeat(
        64,
      )}`,
    );
  });

  it("Should have administrator role to administratorSigner address", async () => {
    const administratorRoleHash = await proxyMarbleLsd.ADMINISTRATOR_ROLE();
    expect(
      await proxyMarbleLsd.hasRole(
        administratorRoleHash,
        administratorSigner.address,
      ),
    ).to.equal(true);
  });

  it("Should have reward distributer role to rewardDistributerAndFinalizeSigner address", async () => {
    const rewardDistributerRoleHash =
      await proxyMarbleLsd.REWARDS_DISTRIBUTER_ROLE();
    expect(
      await proxyMarbleLsd.hasRole(
        rewardDistributerRoleHash,
        rewardDistributerAndFinalizeSigner.address,
      ),
    ).to.equal(true);
  });

  it("Should have finalizer role to rewardDistributerAndFinalizeSigner address", async () => {
    const finalizerRoleHash = await proxyMarbleLsd.FINALIZE_ROLE();
    expect(
      await proxyMarbleLsd.hasRole(
        finalizerRoleHash,
        rewardDistributerAndFinalizeSigner.address,
      ),
    ).to.equal(true);
  });

  it("Should have DEFAULT_ADMIN_ROLE as role admin", async () => {
    const adminRoleHash = await proxyMarbleLsd.DEFAULT_ADMIN_ROLE();
    expect(await proxyMarbleLsd.getRoleAdmin(adminRoleHash)).to.equal(
      adminRoleHash,
    );
    const administratorRoleHash = await proxyMarbleLsd.ADMINISTRATOR_ROLE();
    expect(await proxyMarbleLsd.getRoleAdmin(administratorRoleHash)).to.equal(
      adminRoleHash,
    );
    const rewardDistributerRoleHash =
      await proxyMarbleLsd.REWARDS_DISTRIBUTER_ROLE();
    expect(
      await proxyMarbleLsd.getRoleAdmin(rewardDistributerRoleHash),
    ).to.equal(adminRoleHash);
    const finalizerRoleHash = await proxyMarbleLsd.FINALIZE_ROLE();
    expect(await proxyMarbleLsd.getRoleAdmin(finalizerRoleHash)).to.equal(
      adminRoleHash,
    );
  });

  it("Should grant role by default admin address for DEFAULT_ADMIN_ROLE", async () => {
    const signer = accounts[5];
    const adminRoleHash = await proxyMarbleLsd.DEFAULT_ADMIN_ROLE();
    await proxyMarbleLsd
      .connect(defaultAdminSigner)
      .grantRole(adminRoleHash, signer.address);
    expect(
      await proxyMarbleLsd.hasRole(adminRoleHash, signer.address),
    ).to.equal(true);
  });

  it("Should grant role by default admin address for ADMINISTRATOR_ROLE", async () => {
    const signer = accounts[5];
    const administratorRoleHash = await proxyMarbleLsd.ADMINISTRATOR_ROLE();
    await proxyMarbleLsd
      .connect(defaultAdminSigner)
      .grantRole(administratorRoleHash, signer.address);
    expect(
      await proxyMarbleLsd.hasRole(administratorRoleHash, signer.address),
    ).to.equal(true);
  });

  it("Should grant role by default admin address for FINALIZE_ROLE", async () => {
    const signer = accounts[5];
    const finalizeRoleHash = await proxyMarbleLsd.FINALIZE_ROLE();
    await proxyMarbleLsd
      .connect(defaultAdminSigner)
      .grantRole(finalizeRoleHash, signer.address);
    expect(
      await proxyMarbleLsd.hasRole(finalizeRoleHash, signer.address),
    ).to.equal(true);
  });

  it("Should grant role by default admin address for REWARDS_DISTRIBUTER_ROLE", async () => {
    const signer = accounts[5];
    const rewardDistributerRoleHash =
      await proxyMarbleLsd.REWARDS_DISTRIBUTER_ROLE();
    await proxyMarbleLsd
      .connect(defaultAdminSigner)
      .grantRole(rewardDistributerRoleHash, signer.address);
    expect(
      await proxyMarbleLsd.hasRole(rewardDistributerRoleHash, signer.address),
    ).to.equal(true);
  });
});
