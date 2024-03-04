import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { expect } from 'chai';

import { deployContracts } from './testUtils/deployment';

describe('Disable the initialization for MarbleLsdV1', () => {
  it('Should disable the initialization of the implementation contract after creating it', async () => {
    const { marbleLsdImplementation, defaultAdminSigner, walletSigner } = await loadFixture(deployContracts);
    await expect(
      marbleLsdImplementation.initialize(
        defaultAdminSigner.address,
        walletSigner.address,
        'DFI STAKING RECEIPT TOKEN',
        'xDFI'
      ),
    ).to.be.revertedWith('Initializable: contract is already initialized');
  });
});
