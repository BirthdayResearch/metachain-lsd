import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { expect } from 'chai';
import { ethers } from 'hardhat';

import { MarbleLsdV1, MarbleLsdV2__factory } from '../generated';
import { deployContracts } from './testUtils/deployment';


describe('Proxy behavior', () => {
  it("Upgrade and test contract's functionality and storage slots", async () => {
    const { proxyMarbleLsd, defaultAdminSigner, rewardDistributerAndFinalizeSigner } = await loadFixture(deployContracts);
    // MarbleV1 should have version 1
    expect(await proxyMarbleLsd.version()).to.equal('1');
    expect(await proxyMarbleLsd.NAME()).to.equal('MARBLE_LSD');
    const tokenAddress = await proxyMarbleLsd.shareToken()
    const walletAddress = await proxyMarbleLsd.walletAddress()
    // Encoded MarbleLsdV2 data
    const MarbleLsdV2Upgradeable = await ethers.getContractFactory('MarbleLsdV2');
    const marbleLsdV2Upgradeable = await MarbleLsdV2Upgradeable.deploy();
    await marbleLsdV2Upgradeable.waitForDeployment();
    const encodedData = MarbleLsdV2__factory.createInterface().encodeFunctionData('initialize', [
      // Contract version
      2,
    ]);

    // Upgrading the Proxy contract
    const marbleLsdV2UpgradeableAddress = await marbleLsdV2Upgradeable.getAddress()
    await proxyMarbleLsd.upgradeToAndCall(marbleLsdV2UpgradeableAddress, encodedData);
    const marbleLsdV2 = MarbleLsdV2Upgradeable.attach(await proxyMarbleLsd.getAddress()) as MarbleLsdV1;

    expect(await marbleLsdV2.version()).to.equal('2');
    expect(await marbleLsdV2.NAME()).to.equal('MARBLE_LSD');
    // Deployment tests
    const DEFAULT_ADMIN_ROLE = '0x0000000000000000000000000000000000000000000000000000000000000000';
    expect(await marbleLsdV2.hasRole(DEFAULT_ADMIN_ROLE, await defaultAdminSigner.getAddress())).to.equal(true);
    const REWARDS_DISTRIBUTER_ROLE = await marbleLsdV2.REWARDS_DISTRIBUTER_ROLE()
    expect(await marbleLsdV2.hasRole(REWARDS_DISTRIBUTER_ROLE, await rewardDistributerAndFinalizeSigner.getAddress())).to.equal(true);
    const FINALIZE_ROLE = await marbleLsdV2.FINALIZE_ROLE()
    expect(await marbleLsdV2.hasRole(FINALIZE_ROLE, await rewardDistributerAndFinalizeSigner.getAddress())).to.equal(true);
    expect(await marbleLsdV2.shareToken()).to.equal(tokenAddress);
    expect(await marbleLsdV2.walletAddress()).to.equal(walletAddress);
  });
});
