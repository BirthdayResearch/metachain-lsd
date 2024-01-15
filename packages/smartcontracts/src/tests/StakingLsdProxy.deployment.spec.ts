import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { expect } from 'chai';

import { deployContracts } from './testUtils/deployment';

describe('StakingLsdV1 deployment test', () => {
  it('StakingLsdV1 should be deployed with correct Admin, Withdraw and relayer addresses', async () => {
    const { proxyStakingLsd, defaultAdminSigner, walletSigner } = await loadFixture(deployContracts);
    // Check if the accounts[0] has the admin role.
    const DEFAULT_ADMIN_ROLE = '0x0000000000000000000000000000000000000000000000000000000000000000';
    expect(await proxyStakingLsd.hasRole(DEFAULT_ADMIN_ROLE, defaultAdminSigner.address)).to.equal(true);
    // Check if the relayer address is same as accounts[0]
    expect(walletSigner.address).to.be.equal(await proxyStakingLsd.walletAddress());
    // checking Contract version, should be 1
    expect(await proxyStakingLsd.version()).to.be.equal('1');
  });

  it('Successfully fetching constants', async () => {
    const { proxyStakingLsd } = await loadFixture(deployContracts);
    expect(await proxyStakingLsd.NAME()).to.be.equal('STAKING_LSD');
  });
});
