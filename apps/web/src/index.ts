import { ContractContextI } from "@/app/lib/types";

export const MAINNET_CONFIG: ContractContextI = {
  EthereumRpcUrl:
    "https://mainnet.infura.io/v3/df267399d98e41e996d6588a76678d5e",
  ExplorerURL: "https://etherscan.io",
};

// Sepolia
export const TESTNET_CONFIG: ContractContextI = {
  EthereumRpcUrl: "https://rpc.ankr.com/eth_sepolia",
  ExplorerURL: "https://sepolia.etherscan.io",
};
