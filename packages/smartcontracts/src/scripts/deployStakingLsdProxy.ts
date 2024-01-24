import { ethers } from 'hardhat';

import { StakingLsdProxy, StakingLsdV1, StakingLsdV1__factory } from '../generated';
import { verify } from './utils/verify';

export async function deployStakingLsdProxy({
  adminAddress,
  walletAddress,
  stakingLsdV1Address,
}: InputsForInitialization): Promise<StakingLsdProxy> {
  const contract = await ethers.getContractFactory('StakingLsdProxy');
  const receiptTokenName = 'DFI STAKING RECEIPT TOKEN';
  const receiptTokenSymbol = 'xDFI';
  const encodedData = StakingLsdV1__factory.createInterface().encodeFunctionData('initialize', [
    // admin address, or timelock contract address
    adminAddress,
    // withdraw address
    walletAddress,
    // receipt token name
    receiptTokenName,
    // receipt token symbol
    receiptTokenSymbol,
  ]);
  const stakingLsdProxy = await contract.deploy(stakingLsdV1Address, encodedData);
  await stakingLsdProxy.waitForDeployment();
  const stakingLsdProxyAddress = await stakingLsdProxy.getAddress();
  const txn = await stakingLsdProxy.deploymentTransaction();
  await txn?.wait(10);
  console.log('Proxy Address: ', stakingLsdProxyAddress);
  console.log('Verifying...');
  await verify({
    contractAddress: stakingLsdProxyAddress,
    args: [stakingLsdV1Address, encodedData],
    contract: 'contracts/StakingLsdProxy.sol:StakingLsdProxy',
  });
  // verify receipt token
  const StakingLsdUpgradeable = await ethers.getContractFactory('StakingLsdV1');
  const proxyStakingLsd = StakingLsdUpgradeable.attach(stakingLsdProxyAddress) as StakingLsdV1;

  const receiptToken = await proxyStakingLsd.receiptToken();
  console.log('Receipt Token Address: ', receiptToken);
  console.log('Verifying...');
  await verify({
    contractAddress: receiptToken,
    args: [receiptTokenName, receiptTokenSymbol],
  });
  return stakingLsdProxy;
}

interface InputsForInitialization {
  adminAddress: string;
  walletAddress: string;
  stakingLsdV1Address: string;
}
