import { ContractContextI } from "@/lib/types";
import { MarbleLsdV1__factory } from "smartcontracts/src";

// export const MAINNET_CONFIG: ContractContextI = {
//   EthereumRpcUrl:
//     "https://mainnet.infura.io/v3/df267399d98e41e996d6588a76678d5e",
//   ExplorerURL: "https://etherscan.io",
//   // TO CHANGE once deployed on mainnet
//   MarbleLsdV1: {
//     address: "0x54346d39976629b65ba54eac1c9ef0af3be1921b",
//     abi: MarbleLsdV1__factory.abi,
//   },
// };

// // TO CHANGE once deployed on mainnet
export const MAINNET_CONFIG: ContractContextI = {
  EthereumRpcUrl: "https://rpc.ankr.com/eth_sepolia",
  ExplorerURL: "https://sepolia.etherscan.io",
  MarbleLsdV1: {
    address: "0x9FA70916182c75F401bF038EC775266941C46909",
    abi: MarbleLsdV1__factory.abi,
  },
  Erc20Tokens: {
    DFI: { address: "0x8fc8f8269ebca376d046ce292dc7eac40c8d358a" },
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
  Erc20Tokens: {
    DFI: { address: "0x1f84B07483AC2D5f212a7bF14184310baE087448" },
  },
};
