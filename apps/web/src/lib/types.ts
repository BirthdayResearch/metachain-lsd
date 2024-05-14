interface ContractConfigI {
  address: `0x${string}`;
  abi?: any;
}

export interface ContractContextI {
  EthereumRpcUrl: string;
  ExplorerURL: string;
  MarbleLsdProxy: ContractConfigI;
}
