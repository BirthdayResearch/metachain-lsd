import { ContractContextI } from "@/lib/types";
import { MarbleLsdV1__factory } from "smartcontracts/src";

// TO CHANGE once deployed on mainnet
export const SEPOLIA_CONFIG: ContractContextI = {
  EthereumRpcUrl: "https://rpc.ankr.com/eth_sepolia",
  ExplorerURL: "https://sepolia.etherscan.io",
  MarbleLsdV1: {
    address: "0x9FA70916182c75F401bF038EC775266941C46909",
    abi: MarbleLsdV1__factory.abi,
  },
};

// TO CHANGE once deployed on mainnet
export const MAINNET_CONFIG: ContractContextI = {
  EthereumRpcUrl: "https://rpc.ankr.com/eth_sepolia",
  ExplorerURL: "https://sepolia.etherscan.io",
  MarbleLsdV1: {
    address: "0x9FA70916182c75F401bF038EC775266941C46909",
    abi: MarbleLsdV1__factory.abi,
  },
};

// Sepolia
export const TESTNET_CONFIG: ContractContextI = {
  EthereumRpcUrl: "https://rpc.ankr.com/eth_sepolia",
  ExplorerURL: "https://sepolia.etherscan.io",
  MarbleLsdV1: {
    address: "0x9FA70916182c75F401bF038EC775266941C46909",
    abi: MarbleLsdV1__factory.abi,
  },
};
