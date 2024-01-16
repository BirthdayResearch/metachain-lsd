import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { expect } from 'chai';

import { deployContracts } from './testUtils/deployment';

describe('Disable the initialization for StakingLsdV1', () => {
  it('Should disable the initialization of the implementation contract after creating it', async () => {
    const { stakingLsdImplementation, defaultAdminSigner, walletSigner, receiptToken } =
      await loadFixture(deployContracts);
    const tokenAddress = await receiptToken.getAddress()
    await expect(
      stakingLsdImplementation.initialize(
        defaultAdminSigner.address,
        walletSigner.address,
        tokenAddress
      ),
    ).to.be.revertedWith('Initializable: contract is already initialized');
  });
});
