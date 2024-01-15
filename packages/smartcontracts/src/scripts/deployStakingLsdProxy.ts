import { ethers } from 'hardhat';

import { StakingLsdProxy, StakingLsdV1__factory } from '../generated';
import { verify } from './utils/verify';

// npx hardhat run --network sepolia ./scripts/deployStakingLsdV1.ts
export async function deployStakingLsdProxy({
  adminAddress,
  walletAddress,
  stakingLsdV1Address
}: InputsForInitialization): Promise<StakingLsdProxy> {
  const contract = await ethers.getContractFactory('StakingLsdProxy');
  const encodedData = StakingLsdV1__factory.createInterface().encodeFunctionData('initialize', [
    // admin address, or timelock contract address
    adminAddress,
    // withdraw address
    walletAddress,
  ]);
  const stakingLsdProxy = await contract.deploy(stakingLsdV1Address, encodedData);
  await stakingLsdProxy.waitForDeployment();
  const stakingLsdProxyAddress = await stakingLsdProxy.getAddress()
 
  console.log('Proxy Address: ', stakingLsdProxyAddress);
  console.log('Verifying...');
  await verify({ contractAddress: stakingLsdProxyAddress, args: [stakingLsdV1Address, encodedData] });
  return stakingLsdProxy;
}

interface InputsForInitialization {
  adminAddress: string;
  walletAddress: string;
  stakingLsdV1Address: string;
}
