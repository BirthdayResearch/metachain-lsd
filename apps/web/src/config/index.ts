import LSDV1Testnet from "./ABIs/LSDV1Testnet.json";

interface ContractConfigI {
  address: `0x${string}`;
  abi?: any;
}

export interface ContractContextI {
  EthereumRpcUrl: string;
  ExplorerURL: string;
  LSDV1: ContractConfigI;
}

// Sepolia
export const TESTNET_CONFIG: ContractContextI = {
  EthereumRpcUrl:
    "wss://sepolia.infura.io/ws/v3/c0cb8ac8e57a4b9782198aeae2c68d8e",
  ExplorerURL: "https://sepolia.etherscan.io",
  LSDV1: {
    address: "0xCce7B4FE99F7fa97DE6e031886D77B43447E81Ae",
    abi: LSDV1Testnet,
  },
};
