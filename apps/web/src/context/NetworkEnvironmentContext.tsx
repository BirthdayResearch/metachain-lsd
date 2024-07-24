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
import { EnvironmentNetwork, getEnvironment } from "@waveshq/walletkit-core";
import { DFI_TESTNET_ID } from "@/constants";

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
  const { chain } = useAccount();

  function getInitialNetwork(n: EnvironmentNetwork): EnvironmentNetwork {
    if (chain === undefined) {
      return env.networks.includes(n) ? n : defaultNetwork;
    }
    const isDFITestNet = chain?.id === DFI_TESTNET_ID;
    return isDFITestNet
      ? EnvironmentNetwork.TestNet
      : EnvironmentNetwork.MainNet;
  }

  const [networkEnv, setNetworkEnv] = useState<EnvironmentNetwork>(
    getInitialNetwork(networkQuery as EnvironmentNetwork),
  );

  const getQueryStaring = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(name, value);
    return params.toString();
  };

  const updateRoute = (value: EnvironmentNetwork) => {
    router.replace(
      pathName +
        "?" +
        (value === defaultNetwork ? "" : getQueryStaring("network", value)),
    );
  };

  useEffect(() => {
    const initialNetwork = getInitialNetwork(
      networkQuery as EnvironmentNetwork,
    );
    setNetworkEnv(initialNetwork);
  }, [chain]);

  const handleNetworkEnvChange = (value: EnvironmentNetwork) => {
    setNetworkEnv(value);
    updateRoute(value);
  };

  const resetNetworkEnv = () => {
    handleNetworkEnvChange(networkEnv);
  };

  useEffect(() => {
    handleNetworkEnvChange(networkEnv);
  }, [networkEnv]);

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
