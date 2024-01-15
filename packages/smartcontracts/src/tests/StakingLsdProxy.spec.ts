import { SignerWithAddress } from '@nomicfoundation/hardhat-ethers/signers';
import { loadFixture, time } from '@nomicfoundation/hardhat-network-helpers';
import { expect } from 'chai';
import { ethers } from 'hardhat';

import { StakingLsdV1 } from '../generated';
import { deployContracts, StakingLsdDeploymentResult } from './testUtils/deployment';
import { toWei } from './testUtils/mathUtils';

describe('StakingLsdProxy', () => {
  let proxyStakingLsd: StakingLsdV1;
  let defaultAdminSigner: SignerWithAddress;
  let walletSigner: SignerWithAddress;
  let accounts: SignerWithAddress[] = [];

  before(async () => {
    const fixture: StakingLsdDeploymentResult = await loadFixture(deployContracts);
    proxyStakingLsd = fixture.proxyStakingLsd;
    defaultAdminSigner = fixture.defaultAdminSigner;
    walletSigner = fixture.walletSigner;
    accounts = await ethers.getSigners();
  })

  it('Should have total supply=0 before staking any DFI', async () => {
    const initialSupply = await proxyStakingLsd.totalSupply()
    expect(initialSupply).to.equal('0');
  });

  it('Should fail when stake zero DFI', async () => {
    await expect(proxyStakingLsd.stake({ value: 0 }))
    .to.be.revertedWithCustomError(proxyStakingLsd, "AMOUNT_IS_ZERO");
  });

  it('Should fail when withdraw zero amount', async () => {
    await expect(proxyStakingLsd.withdraw(0))
    .to.be.revertedWithCustomError(proxyStakingLsd, "AMOUNT_IS_ZERO");
  });

  it('Should fail when withdraw before staking', async () => {
    await expect(proxyStakingLsd.withdraw(100))
    .to.be.revertedWithCustomError(proxyStakingLsd, "INSUFFICIENT_AMOUNT");
  });

  it('Should stake DFI and emit STAKE event on successful staking', async () => {
    // Need to add to the timestamp of the previous block to match the next block the tx is mined in
    const expectedTimestamp = (await time.latest()) + 1;
    const amount = toWei('10');
    const signer = accounts[4]
    await expect(proxyStakingLsd.connect(signer).stake({ value: amount }))
    .to.emit(proxyStakingLsd, 'STAKE')
    .withArgs(signer.address, amount, expectedTimestamp);
    const initialSupply = await proxyStakingLsd.totalSupply()
    expect(initialSupply).to.equal(amount);
  });

  it('Should be able to withdraw DFI and emit WITHDRAW event on successful withdraw', async () => {
    // Need to add to the timestamp of the previous block to match the next block the tx is mined in
    const expectedTimestamp = (await time.latest()) + 1;
    const amount = toWei('10');
    const signer = accounts[4]
    await expect(proxyStakingLsd.connect(signer).withdraw(amount))
    .to.emit(proxyStakingLsd, 'WITHDRAW')
    .withArgs(signer.address, amount, expectedTimestamp);
    const initialSupply = await proxyStakingLsd.totalSupply()
    expect(initialSupply).to.equal('0');
  });
  
  describe('Wallet address change tests', () => {
    it('Unable to change if new address is 0x0', async () => {
      // Test will fail with the error if input address is a dead address "0x0"
      expect(await proxyStakingLsd.walletAddress()).to.equal(walletSigner.address);
      await expect(
        proxyStakingLsd.connect(defaultAdminSigner).changeWalletAddress('0x0000000000000000000000000000000000000000'),
      ).to.be.revertedWithCustomError(proxyStakingLsd, 'ZERO_ADDRESS');
    });

    it('Unable to change wallet address if not DEFAULT_ADMIN_ROLE', async () => {
      expect(await proxyStakingLsd.walletAddress()).to.equal(walletSigner.address);
      // Test will fail if the signer is neither admin or operational admin
      const newSigner = accounts[10]
      await expect(
        proxyStakingLsd.connect(newSigner).changeWalletAddress(newSigner.address),
      ).to.be.revertedWith(
        `AccessControl: account ${newSigner.address.toLowerCase()} is missing role 0x${'0'.repeat(64)}`,
      );
      expect(await proxyStakingLsd.walletAddress()).to.equal(walletSigner.address);
    });

    it('Successfully change the wallet address By Admin account', async () => {
      expect(await proxyStakingLsd.walletAddress()).to.equal(walletSigner.address);
      // Change wallet address by Admin and Operational addresses
      const newSigner = accounts[10]
      await expect(proxyStakingLsd.connect(defaultAdminSigner).changeWalletAddress(newSigner.address))
        .to.emit(proxyStakingLsd, 'WALLET_ADDRESS_CHANGED')
        .withArgs(walletSigner.address, newSigner.address);;
      expect(await proxyStakingLsd.walletAddress()).to.equal(newSigner.address);
    });
  });
});
