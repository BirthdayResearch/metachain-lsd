import { ContractContextI } from "@/lib/types";
import { MarbleLsdV1__factory } from "smartcontracts/src";

// TO CHANGE once deployed on mainnet
export const SEPOLIA_CONFIG: ContractContextI = {
  EthereumRpcUrl: "https://rpc.ankr.com/eth_sepolia",
  ExplorerURL: "https://sepolia.etherscan.io",
  MarbleLsdProxy: {
    address: "0x49A3e882B8Ca7BA93CD412D8dbF8b5f0C9f8FD94",
    abi: MarbleLsdV1__factory.abi,
  },
};

// TO CHANGE once deployed on mainnet
export const MAINNET_CONFIG: ContractContextI = {
  EthereumRpcUrl: "https://rpc.ankr.com/eth_sepolia",
  ExplorerURL: "https://sepolia.etherscan.io",
  MarbleLsdProxy: {
    address: "0x49A3e882B8Ca7BA93CD412D8dbF8b5f0C9f8FD94",
    abi: MarbleLsdV1__factory.abi,
  },
};

// Sepolia
export const TESTNET_CONFIG: ContractContextI = {
  EthereumRpcUrl: "https://eth.testnet.ocean.jellyfishsdk.com",
  ExplorerURL: "https://blockscout.testnet.ocean.jellyfishsdk.com",
  MarbleLsdProxy: {
    address: "0x0B52a71A03a47246BD9d9C556B6Df9C42e73462A",
    abi: MarbleLsdV1__factory.abi,
  },
};
