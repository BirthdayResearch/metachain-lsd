import { MarbleLsdV1__factory, ShareToken__factory } from "smartcontracts/src";

interface MarbleFiContractConfigI {
  address: `0x${string}`;
  abi?: typeof MarbleLsdV1__factory.abi;
}

interface MDfiContractConfigI {
  address: `0x${string}`;
  abi?: typeof ShareToken__factory.abi;
}

export interface MarbleFiVersion {
  v: string;
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

export interface SmartContractInputOutput {
  internalType: string;
  name: string;
  type: string;
}

export interface SmartContractOutputWithValue {
  type: string;
  value: any;
}

export enum StateMutability {
  "Payable" = "payable",
  "Nonpayable" = "nonpayable",
  "View" = "view",
  "Pure" = "pure",
}

export interface SmartContractMethod {
  inputs: SmartContractInputOutput[] | [];
  outputs: SmartContractInputOutput[] | SmartContractOutputWithValue[];
  method_id?: string;
  name: string;
  names?: string[];
  stateMutability: StateMutability;
  type: string;
  description?: string; // TODO: Check if possible to get
  error?: string;
}

export interface DashboardWriteMethodI {
  name: string;
  role?: string[]; // not using this param yet, will add role check in next release
  description: string;
}
