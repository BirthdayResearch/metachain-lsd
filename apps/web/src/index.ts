import { ContractContextI } from "@/lib/types";
import { MarbleLsdV1__factory, ShareToken__factory } from "smartcontracts/src";

// TO CHANGE once deployed on mainnet
export const SEPOLIA_CONFIG: ContractContextI = {
  EthereumRpcUrl: "https://rpc.ankr.com/eth_sepolia",
  ExplorerURL: "https://sepolia.etherscan.io",
  MarbleLsdProxy: {
    address: "0x49A3e882B8Ca7BA93CD412D8dbF8b5f0C9f8FD94",
    abi: MarbleLsdV1__factory.abi,
  },
  mDFI: {
    address: "0x1F1BCfbF082e274D0eeE0ED62C28CE51B6A33330",
    abi: ShareToken__factory.abi,
    decimal: 18,
    symbol: "mDFI",
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
  mDFI: {
    address: "0x1F1BCfbF082e274D0eeE0ED62C28CE51B6A33330",
    abi: ShareToken__factory.abi,
    decimal: 18,
    symbol: "mDFI",
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
  mDFI: {
    address: "0x1F1BCfbF082e274D0eeE0ED62C28CE51B6A33330",
    abi: ShareToken__factory.abi,
    decimal: 18,
    symbol: "mDFI",
  },
};
