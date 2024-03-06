import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { expect } from 'chai';
import { ethers } from 'hardhat';

import { MarbleLsdDeploymentResult, deployContracts } from './testUtils/deployment';
import { MarbleLsdV1, ShareToken } from '../generated';
import { SignerWithAddress } from '@nomicfoundation/hardhat-ethers/signers';

describe('MarbleLsdFees', () => {
  let proxyMarbleLsd: MarbleLsdV1;
  let administratorSigner: SignerWithAddress;
  let walletSigner: SignerWithAddress;
  let accounts: SignerWithAddress[] = [];
  let shareToken: ShareToken;

  before(async () => {
    const fixture: MarbleLsdDeploymentResult = await loadFixture(deployContracts);
    proxyMarbleLsd = fixture.proxyMarbleLsd;
    administratorSigner = fixture.administratorSigner;
    walletSigner = fixture.walletSigner;
    shareToken = fixture.shareToken;
    accounts = await ethers.getSigners();
  })

  it('Should have default minting fee as 0.5%', async () => {
    const mintingFees = await proxyMarbleLsd.mintingFees()
    expect(mintingFees).to.be.equal('50');
  });

  it('Should have default redemption fees fee as 0.75%', async () => {
    const redemptionFees = await proxyMarbleLsd.redemptionFees()
    expect(redemptionFees).to.be.equal('75');
  });

  it('Should have default performance fees fee as 8%', async () => {
    const performanceFees = await proxyMarbleLsd.performanceFees()
    expect(performanceFees).to.be.equal('800');
  });

  it('Should not update minting fees from non administrator address', async () => {
    const signer = accounts[5]
    const administratorRoleHash = await proxyMarbleLsd.ADMINISTRATOR_ROLE();
    await expect(
      proxyMarbleLsd.connect(signer).updateMintingFees(10),
    ).to.be.revertedWith(
      `AccessControl: account ${signer.address.toLowerCase()} is missing role ${administratorRoleHash}`,
    );
  });

  it('Should not update redemption fees from non administrator address', async () => {
    const signer = accounts[5]
    const administratorRoleHash = await proxyMarbleLsd.ADMINISTRATOR_ROLE();
    await expect(
      proxyMarbleLsd.connect(signer).updateRedemptionFees(10),
    ).to.be.revertedWith(
      `AccessControl: account ${signer.address.toLowerCase()} is missing role ${administratorRoleHash}`,
    );
  });

  it('Should not update performance fees from non administrator address', async () => {
    const signer = accounts[5]
    const administratorRoleHash = await proxyMarbleLsd.ADMINISTRATOR_ROLE();
    await expect(
      proxyMarbleLsd.connect(signer).updatePerformanceFees(10),
    ).to.be.revertedWith(
      `AccessControl: account ${signer.address.toLowerCase()} is missing role ${administratorRoleHash}`,
    );
  });

  it('Should not update minting fees more than _BASIS_POINT_SCALE', async () => {
    await expect(
      proxyMarbleLsd.connect(administratorSigner).updateMintingFees(10001),
    ).to.be.revertedWithCustomError(proxyMarbleLsd, 'INVALID_FEES');
  });

  it('Should not update redemption fees more than _BASIS_POINT_SCALE', async () => {
    await expect(
      proxyMarbleLsd.connect(administratorSigner).updateRedemptionFees(10001),
    ).to.be.revertedWithCustomError(proxyMarbleLsd, 'INVALID_FEES');
  });

  it('Should not update performance fees more than _BASIS_POINT_SCALE', async () => {
    await expect(
      proxyMarbleLsd.connect(administratorSigner).updatePerformanceFees(10001),
    ).to.be.revertedWithCustomError(proxyMarbleLsd, 'INVALID_FEES');
  });

  it('Should update minting fees', async () => {
    await proxyMarbleLsd.connect(administratorSigner).updateMintingFees(110)
    const updatedFees = await proxyMarbleLsd.mintingFees()
    expect(updatedFees).to.equal(110);
  });

  it('Should update redemption fees', async () => {
    await proxyMarbleLsd.connect(administratorSigner).updateRedemptionFees(110)
    const updatedFees = await proxyMarbleLsd.redemptionFees()
    expect(updatedFees).to.equal(110);
  });

  it('Should update performance fees', async () => {
    await proxyMarbleLsd.connect(administratorSigner).updatePerformanceFees(110)
    const updatedFees = await proxyMarbleLsd.performanceFees()
    expect(updatedFees).to.equal(110);
  });
});
