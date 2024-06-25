import { ContractContextI } from "@/lib/types";
import { MarbleLsdV1__factory, ShareToken__factory } from "smartcontracts/src";

// TO CHANGE once deployed on mainnet
export const MAINNET_CONFIG: ContractContextI = {
  EthereumRpcUrl: "https://eth.mainnet.ocean.jellyfishsdk.com",
  ExplorerURL: "https://blockscout.mainnet.ocean.jellyfishsdk.com",
  MarbleLsdProxy: {
    address: "0x7625924EFb4835E9459a4Ea6bA17ea99FBb7883B",
    abi: MarbleLsdV1__factory.abi,
  },
  mDFI: {
    address: "0xDB9d6fbF5b971Ae3C3a333cc31DB7105e1534998",
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
    address: "0x960e9a07e36dc74302e707d84b5eb772dae726cc",
    abi: ShareToken__factory.abi,
    decimal: 18,
    symbol: "mDFI",
  },
};
