import { ethers } from 'hardhat';

import { deployMarbleLsdProxy } from "./deployMarbleLsdProxy";
import { deployMarbleLsdV1 } from "./deployMarbleLsdV1";
import { deployTimelockController } from "./deployTimelockController";

// when deploying, replace the following values with the correct ones
const minDelay = 259200; // 3 days
const WALLET_ADDRESS = ''; // Multi sig wallet
const ADMINISTRATOR_ADDRESS = ''; // Multi sig wallet
const REWARD_DISTRIBUTER_ADDRESS = ''; // Multi sig wallet
const FINALIZER_ADDRESS = ''; // Multi sig wallet
const TIMELOCK_ADMIN_ADDRESS = ''; // Multi sig wallet
// Run this script to deploy all contracts on mainnet.
// npx hardhat run --network mainnet ./src/scripts/deploy.ts  --config ./src/hardhat.config.ts

// Run this script to deploy all contracts on Sepolia testnet.
// npx hardhat run --network sepolia ./src/scripts/deploy.ts

async function main() {
  const marbleLsdV1 = await deployMarbleLsdV1();
  const marbleLsdV1Address = await marbleLsdV1.getAddress()
  const timelockController = await deployTimelockController({
    minDelay,
    proposers: [TIMELOCK_ADMIN_ADDRESS],
    executors: [TIMELOCK_ADMIN_ADDRESS],
    admin: ethers.ZeroAddress,
  });
  const timelockControllerAddress =  await timelockController.getAddress()
  await deployMarbleLsdProxy({
    adminAddress: timelockControllerAddress,
    administratorAddress: ADMINISTRATOR_ADDRESS,
    walletAddress: WALLET_ADDRESS,
    rewardDistributerAddress: REWARD_DISTRIBUTER_ADDRESS,
    finalizerAddress: FINALIZER_ADDRESS,
    marbleLsdV1Address
  });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
