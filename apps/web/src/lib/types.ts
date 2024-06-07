import { MarbleLsdV1__factory, ShareToken__factory } from "smartcontracts/src";

interface MarbleFiContractConfigI {
  address: `0x${string}`;
  abi?: typeof MarbleLsdV1__factory.abi;
}

interface MDfiContractConfigI {
  address: `0x${string}`;
  abi?: typeof ShareToken__factory.abi;
}
export interface ContractContextI {
  EthereumRpcUrl: string;
  ExplorerURL: string;
  MarbleLsdProxy: MarbleFiContractConfigI;
  mDFI: MDfiContractConfigI & {
    decimal: number;
    symbol: string;
  };
}

export interface AppNavigation {
  label: string;
  href: string;
}
