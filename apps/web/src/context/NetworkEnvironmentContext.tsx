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
  // TODO set defaultNetwork to mainnet
  const defaultNetwork = EnvironmentNetwork.TestNet;
  const { updateNetwork: updateWhaleNetwork } = useWhaleNetworkContext();
  const { chain } = useAccount();

  function getInitialNetwork(n: EnvironmentNetwork): EnvironmentNetwork {
    // TODO remove this on mainnet Prod launch
    if (process.env.NODE_ENV !== "development") {
      return EnvironmentNetwork.TestNet;
    }
    if (chain === undefined) {
      return env.networks.includes(n) ? n : defaultNetwork;
    }
    const isDFIMainNet = chain?.id === DFI_MAINNET_ID;
    return isDFIMainNet
      ? EnvironmentNetwork.MainNet
      : EnvironmentNetwork.TestNet;
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
    updateWhaleNetwork(value);
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
