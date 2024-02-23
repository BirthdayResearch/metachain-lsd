import { ethers } from 'hardhat';

import { TimelockController } from '../generated';
import { verify } from './utils/verify';
import { BigNumberish } from 'ethers';

export async function deployTimelockController({
  minDelay,
  proposers,
  executors,
  admin,
}: InputsForInitialization): Promise<TimelockController> {
  const timelockControllerFactory = await ethers.getContractFactory('TimelockController');
  const timelockController = await timelockControllerFactory.deploy(minDelay, proposers, executors, admin);
  await timelockController.waitForDeployment();
  const contractAddress = await timelockController.getAddress()
  console.log('Timelock Controller Address: ', contractAddress);
  console.log('Verifying...');
  await verify({ contractAddress, args: [minDelay, proposers, executors, admin] });

  return timelockController;
}

interface InputsForInitialization {
  minDelay: BigNumberish;
  proposers: string[];
  executors: string[];
  admin: string;
}
