import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { ethers } from 'hardhat';

import { StakingLsdV1, StakingLsdV1__factory, TestToken } from '../../generated';

export async function deployContracts(): Promise<StakingLsdDeploymentResult> {
  const accounts = await ethers.getSigners();
  const defaultAdminSigner = await ethers.getSigner(accounts[0].address);
  const walletSigner = await ethers.getSigner(accounts[1].address);
  const StakingLsdUpgradeable = await ethers.getContractFactory('StakingLsdV1');
  const stakingLsdUpgradeable = await StakingLsdUpgradeable.deploy();
  await stakingLsdUpgradeable.waitForDeployment();
  const stakingLsdUpgradeableAddress = await stakingLsdUpgradeable.getAddress()
  const StakingLsdProxy = await ethers.getContractFactory('StakingLsdProxy');
  const ERC20 = await ethers.getContractFactory('TestToken');
  const receiptToken = await ERC20.deploy('Test', 'T');
  await receiptToken.waitForDeployment();
  const receiptTokenAddress = await receiptToken.getAddress()
  // deployment arguments for the Proxy contract
  const encodedData = StakingLsdV1__factory.createInterface().encodeFunctionData('initialize', [
    // default admin address
    accounts[0].address,
    // default wallet address
    accounts[1].address,
    // receipt token address
    receiptTokenAddress
  ]);

  const stakingLsdProxy = await StakingLsdProxy.deploy(stakingLsdUpgradeableAddress, encodedData);
  await stakingLsdProxy.waitForDeployment();
  const stakingLsdProxyAddress = await stakingLsdProxy.getAddress()
  const proxyStakingLsd = StakingLsdUpgradeable.attach(stakingLsdProxyAddress);

  return {
    proxyStakingLsd,
    stakingLsdImplementation: stakingLsdUpgradeable,
    defaultAdminSigner,
    walletSigner,
    receiptToken
  };
}

export interface StakingLsdDeploymentResult {
  proxyStakingLsd: StakingLsdV1;
  stakingLsdImplementation: StakingLsdV1;
  defaultAdminSigner: SignerWithAddress;
  walletSigner: SignerWithAddress;
  receiptToken: TestToken;
}
