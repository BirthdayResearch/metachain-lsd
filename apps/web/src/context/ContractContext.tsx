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
import { ContractContextI } from "@/lib/types";

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
    setConfig(getContractConfig(networkEnv));
  }, [networkEnv]);

  const getContractConfig = (networkEnv: EnvironmentNetwork) => {
    if (networkEnv === EnvironmentNetwork.MainNet) {
      return MAINNET_CONFIG;
    }
    return TESTNET_CONFIG;
  };

  return (
    <ContractContext.Provider value={config}>
      {children}
    </ContractContext.Provider>
  );
}
