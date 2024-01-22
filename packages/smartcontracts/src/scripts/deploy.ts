import { deployMarbleLsdProxy } from "./deployMarbleLsdProxy";
import { deployMarbleLsdV1 } from "./deployMarbleLsdV1";

// when deploying, replace the following values with the correct ones
const ADMIN_ADDRESS = '0x6aA59C49B27D9a3cBd9f976f7e6179F84be53C05'; // Multi sig wallet
const WALLET_ADDRESS = '0x6aA59C49B27D9a3cBd9f976f7e6179F84be53C05'; // Multi sig wallet

// Run this script to deploy all contracts on mainnet.
// npx hardhat run --network mainnet ./scripts/deploy.ts

// Run this script to deploy all contracts on Sepolia testnet.
// npx hardhat run --network sepolia ./scripts/deploy.ts


async function main() {
  const marbleLsdV1 = await deployMarbleLsdV1();
  const marbleLsdV1Address = await marbleLsdV1.getAddress()
  await deployMarbleLsdProxy({
    adminAddress: ADMIN_ADDRESS,
    walletAddress: WALLET_ADDRESS,
    marbleLsdV1Address
  });
  
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
