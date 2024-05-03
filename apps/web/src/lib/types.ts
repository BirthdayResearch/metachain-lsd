interface ContractConfigI {
  address: `0x${string}`;
  abi?: any;
}

export type Erc20Token = "DFI";

export interface ContractContextI {
  EthereumRpcUrl: string;
  ExplorerURL: string;
  MarbleLsdV1: ContractConfigI;
}
