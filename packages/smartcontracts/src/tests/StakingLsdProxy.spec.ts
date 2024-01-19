import { SignerWithAddress } from '@nomicfoundation/hardhat-ethers/signers';
import { loadFixture, time } from '@nomicfoundation/hardhat-network-helpers';
import { expect } from 'chai';
import { ethers } from 'hardhat';

import { ReceiptToken,StakingLsdV1 } from '../generated';
import { deployContracts, StakingLsdDeploymentResult } from './testUtils/deployment';
import { toWei } from './testUtils/mathUtils';

describe('StakingLsdProxy', () => {
  let proxyStakingLsd: StakingLsdV1;
  let defaultAdminSigner: SignerWithAddress;
  let walletSigner: SignerWithAddress;
  let accounts: SignerWithAddress[] = [];
  let receiptToken: ReceiptToken;

  before(async () => {
    const fixture: StakingLsdDeploymentResult = await loadFixture(deployContracts);
    proxyStakingLsd = fixture.proxyStakingLsd;
    defaultAdminSigner = fixture.defaultAdminSigner;
    walletSigner = fixture.walletSigner;
    receiptToken = fixture.receiptToken;
    accounts = await ethers.getSigners();
  })

  it('Should have total supply=0 before staking any DFI', async () => {
    const initialSupply = await proxyStakingLsd.totalSupply()
    expect(initialSupply).to.equal('0');
  });

  it('Should have recept token deployed', async () => {
    const address = await proxyStakingLsd.receiptToken()
    expect(address).to.not.equal(null);
    expect(address.length).to.equal(42);
  });

  it('Should get receipt token name', async () => {
    const name = await receiptToken.name()
    expect(name).to.equal('DFI STAKING RECEIPT TOKEN');
  });

  it('Should get receipt token symbol', async () => {
    const symbol = await receiptToken.symbol()
    expect(symbol).to.equal('xDFI');
  });

  it('Should get receipt decimal', async () => {
    const decimal = await receiptToken.decimals()
    expect(decimal).to.equal('18');
  });

  it('Should ensure that the owner of the ReceiptToken contract is set to the Staking contract.', async () => {
    const owner = await receiptToken.owner()
    expect(owner).to.equal(await proxyStakingLsd.getAddress());
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
    // Check receipt token balance
    const balance = await receiptToken.balanceOf(signer.address)
    expect(balance).to.equal(amount);
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
    // Check receipt token balance
    const balance = await receiptToken.balanceOf(signer.address)
    expect(balance).to.equal('0');
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
