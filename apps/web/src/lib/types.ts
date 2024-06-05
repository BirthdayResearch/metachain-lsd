interface ContractConfigI {
  address: `0x${string}`;
  abi?: any;
}

export interface ContractContextI {
  EthereumRpcUrl: string;
  ExplorerURL: string;
  MarbleLsdProxy: ContractConfigI;
  mDFI: ContractConfigI & {
    decimal: number;
    symbol: string;
  };
}

export interface AppNavigation {
  label: string;
  href: string;
}

export interface MarbleFiVersion {
  v: string;
}
