import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  PropsWithChildren,
} from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

import { useAccount } from "wagmi";
import { useNetworkContext as useWhaleNetworkContext } from "@waveshq/walletkit-ui";
import { EnvironmentNetwork, getEnvironment } from "@waveshq/walletkit-core";
import { DFI_MAINNET_ID } from "@/constants";

interface NetworkContextI {
  networkEnv: EnvironmentNetwork;
  updateNetworkEnv: (networkEnv: EnvironmentNetwork) => void;
  resetNetworkEnv: () => void;
}

const NetworkEnvironmentContext = createContext<NetworkContextI>(
  undefined as any,
);

export function useNetworkEnvironmentContext(): NetworkContextI {
  return useContext(NetworkEnvironmentContext);
}

export function NetworkEnvironmentProvider({
  children,
}: PropsWithChildren<{}>): JSX.Element | null {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathName = usePathname();

  const env = getEnvironment(process.env.NODE_ENV);
  const networkQuery = searchParams.get("network");
  const defaultNetwork = EnvironmentNetwork.MainNet;
  const { updateNetwork: updateWhaleNetwork } = useWhaleNetworkContext();
  const { chain } = useAccount();
  console.log(chain?.id);
  const isDFIMainNet = chain?.id === DFI_MAINNET_ID;

  function getInitialNetwork(n: EnvironmentNetwork): EnvironmentNetwork {
    if (chain === undefined || process.env.NODE_ENV === "development") {
      return env.networks.includes(n) ? n : defaultNetwork;
    }

    return isDFIMainNet
      ? EnvironmentNetwork.MainNet
      : EnvironmentNetwork.TestNet;
  }

  const initialNetwork = getInitialNetwork(networkQuery as EnvironmentNetwork);
  const [networkEnv, setNetworkEnv] =
    useState<EnvironmentNetwork>(initialNetwork);

  const getQueryStaring = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(name, value);
    return params.toString();
  };

  // TODO @chloezxyyy url routing on different network
  const updateRoute = (value: EnvironmentNetwork) => {
    router.replace(
      pathName +
        "?" +
        (value === defaultNetwork ? "" : getQueryStaring("network", value)),
    );
  };

  const handleNetworkEnvChange = (value: EnvironmentNetwork) => {
    setNetworkEnv(value);
    updateRoute(value);
    updateWhaleNetwork(value);
  };

  const resetNetworkEnv = () => {
    handleNetworkEnvChange(initialNetwork);
  };

  useEffect(() => {
    setNetworkEnv(initialNetwork);
    updateRoute(initialNetwork);
    updateWhaleNetwork(initialNetwork);
  }, [initialNetwork]);

  const context: NetworkContextI = useMemo(
    () => ({
      networkEnv,
      updateNetworkEnv: handleNetworkEnvChange,
      resetNetworkEnv,
    }),
    [networkEnv, router],
  );

  return (
    <NetworkEnvironmentContext.Provider value={context}>
      {children}
    </NetworkEnvironmentContext.Provider>
  );
}
