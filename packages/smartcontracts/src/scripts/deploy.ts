import { deployStakingLsdProxy } from "./deployStakingLsdProxy";
import { deployStakingLsdV1 } from "./deployStakingLsdV1";

// when deploying, replace the following values with the correct ones
const ADMIN_ADDRESS = ''; // Multi sig wallet
const WALLET_ADDRESS = ''; // Multi sig wallet

// Run this script to deploy all contracts on mainnet.
// npx hardhat run --network mainnet ./scripts/deploy.ts

// Run this script to deploy all contracts on Sepolia testnet.
// npx hardhat run --network sepolia ./scripts/deploy.ts


async function main() {
  const stakingLsdV1 = await deployStakingLsdV1();
  const stakingLsdV1Address = await stakingLsdV1.getAddress()
  await deployStakingLsdProxy({
    adminAddress: ADMIN_ADDRESS,
    walletAddress: WALLET_ADDRESS,
    stakingLsdV1Address
  });
  
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
