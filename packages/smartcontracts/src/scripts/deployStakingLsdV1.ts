import { ethers } from 'hardhat';
import { StakingLsdV1 } from '../generated';
import { verify } from './utils/verify';

// npx hardhat run --network sepolia ./scripts/deployStakingLsdV1.ts
export async function deployStakingLsdV1(): Promise<StakingLsdV1> {
  const contract = await ethers.getContractFactory('StakingLsdV1');
  const stakingLsdV1Contract = await contract.deploy();
  await stakingLsdV1Contract.waitForDeployment();
  const address = await stakingLsdV1Contract.getAddress();
  console.log('StakingLsdV1 address is ', address);
  console.log('Verifying...');
  // This will verify the contract
  await verify({ contractAddress: address });
  return stakingLsdV1Contract;
}
