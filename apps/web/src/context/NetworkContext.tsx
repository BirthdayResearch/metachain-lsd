import { createContext, PropsWithChildren, useContext } from "react";
import {
  Network as NetworkObject,
  getNetwork,
} from "@defichain/jellyfish-network";
import { EnvironmentNetwork } from "@waveshq/walletkit-core";
import { useSearchParams } from "next/navigation";
import { getEnvironment } from "@/context/Environment";

export type NetworkName = NetworkObject["name"];

export interface NetworkContextObject extends NetworkObject {
  connection: EnvironmentNetwork;
}

const NetworkContext = createContext<NetworkContextObject>(undefined as any);

export function useNetwork(): NetworkContextObject {
  return useContext(NetworkContext);
}

export function NetworkProvider(
  props: PropsWithChildren<any>,
): JSX.Element | null {
  const searchParams = useSearchParams();
  const networkQuery = searchParams.get("network");

  const env = getEnvironment();
  const connection = env.resolveConnection(networkQuery as EnvironmentNetwork);

  return (
    <NetworkContext.Provider value={mapNetworkObject(connection)}>
      {props.children}
    </NetworkContext.Provider>
  );
}

function mapNetworkObject(
  connection: EnvironmentNetwork,
): NetworkContextObject {
  switch (connection) {
    case EnvironmentNetwork.MainNet:
      return { connection: connection, ...getNetwork("mainnet") };
    case EnvironmentNetwork.TestNet:
      return { connection: connection, ...getNetwork("testnet") };
    case EnvironmentNetwork.DevNet:
      return { connection: connection, ...getNetwork("devnet") };
    case EnvironmentNetwork.RemotePlayground:
    case EnvironmentNetwork.LocalPlayground:
      return { connection: connection, ...getNetwork("regtest") };
    case EnvironmentNetwork.Changi:
      return { connection: connection, ...getNetwork("changi") };
    default:
      throw new Error(`${connection as string} network not found`);
  }
}
