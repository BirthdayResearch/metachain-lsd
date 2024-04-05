import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  PropsWithChildren,
} from "react";

import { EnvironmentNetwork } from "@waveshq/walletkit-core";
import { useNetworkEnvironmentContext } from "./NetworkEnvironmentContext";
import { MAINNET_CONFIG, TESTNET_CONFIG } from "@/index";

interface ContractConfigI {
  address: `0x${string}`;
  abi?: any;
}

export interface ContractContextI {
  EthereumRpcUrl: string;
  ExplorerURL: string;
  MarbleLsdV1: ContractConfigI;
}

const ContractContext = createContext<ContractContextI>(undefined as any);

export function useContractContext(): ContractContextI {
  return useContext(ContractContext);
}

export function ContractProvider({
  children,
}: PropsWithChildren<{}>): JSX.Element | null {
  const { networkEnv } = useNetworkEnvironmentContext();

  const [config, setConfig] = useState(MAINNET_CONFIG);

  useEffect(() => {
    const contractConfig =
      networkEnv === EnvironmentNetwork.MainNet
        ? MAINNET_CONFIG
        : TESTNET_CONFIG;
    setConfig(contractConfig);
  }, [networkEnv]);

  return (
    <ContractContext.Provider value={config}>
      {children}
    </ContractContext.Provider>
  );
}
