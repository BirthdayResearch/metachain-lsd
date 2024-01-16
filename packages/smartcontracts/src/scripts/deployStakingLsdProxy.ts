import { ethers } from 'hardhat';

import { StakingLsdProxy, StakingLsdV1__factory } from '../generated';
import { verify } from './utils/verify';

// npx hardhat run --network sepolia ./scripts/deployStakingLsdProxy.ts
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
    // receipt token name
    'DFI STAKING RECEIPT TOKEN',
    // receipt token symbol
    'xDFI'
  ]);
  const stakingLsdProxy = await contract.deploy(stakingLsdV1Address, encodedData);
  await stakingLsdProxy.waitForDeployment();
  const stakingLsdProxyAddress = await stakingLsdProxy.getAddress()
  const txn = await stakingLsdProxy.deploymentTransaction()
  await txn?.wait(10);
  console.log('Proxy Address: ', stakingLsdProxyAddress);
  console.log('Verifying...');
  await verify({ contractAddress: stakingLsdProxyAddress, args: [stakingLsdV1Address, encodedData], contract: "./src/contracts/StakingLsdProxy.sol:StakingLsdProxy" });
  return stakingLsdProxy;
}

interface InputsForInitialization {
  adminAddress: string;
  walletAddress: string;
  stakingLsdV1Address: string;
}
