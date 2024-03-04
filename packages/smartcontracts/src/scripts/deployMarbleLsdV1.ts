import { ethers } from 'hardhat';

import { MarbleLsdV1 } from '../generated';
import { verify } from './utils/verify';

// npx hardhat run --network sepolia ./scripts/deployMarbleLsdV1.ts
export async function deployMarbleLsdV1(): Promise<MarbleLsdV1> {
  const contract = await ethers.getContractFactory('MarbleLsdV1');
  const MarbleLsdV1Contract = await contract.deploy();
  await MarbleLsdV1Contract.waitForDeployment();
  const address = await MarbleLsdV1Contract.getAddress();
  const txn = await MarbleLsdV1Contract.deploymentTransaction()
  await txn?.wait(10);
  console.log('MarbleLsdV1 address is ', address);
  console.log('Verifying...');
  // This will verify the contract
  await verify({ contractAddress: address });
  return MarbleLsdV1Contract;
}
