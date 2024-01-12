import { loadFixture, time } from '@nomicfoundation/hardhat-network-helpers';
import { expect } from 'chai';

import { deployContracts, StakingLsdDeploymentResult } from './testUtils/deployment';
import { toWei } from './testUtils/mathUtils';
import { StakingLsdV1, TestToken } from '../generated';
import { SignerWithAddress } from '@nomicfoundation/hardhat-ethers/signers';
import { ethers } from 'hardhat';

describe('StakingLsdProxy', () => {
  let proxyStakingLsd: StakingLsdV1;
  let defaultAdminSigner: SignerWithAddress;
  let walletSigner: SignerWithAddress;
  let receiptToken: TestToken;
  let accounts: SignerWithAddress[] = [];

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
  });

  it('Should be able to withdraw DFI and emit WITHDRAW event on successful withdraw', async () => {
    // Need to add to the timestamp of the previous block to match the next block the tx is mined in
    const expectedTimestamp = (await time.latest()) + 1;
    const amount = toWei('10');
    const signer = accounts[4]
    await expect(proxyStakingLsd.connect(signer).withdraw(amount))
    .to.emit(proxyStakingLsd, 'WITHDRAW')
    .withArgs(signer.address, amount, expectedTimestamp);
  });
});
