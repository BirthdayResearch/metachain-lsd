import { PropsWithChildren, useEffect } from "react";
import { useNetwork } from "@/context/NetworkContext";
import { isPlayground } from "@waveshq/walletkit-core";
import { useWhaleApiClient } from "@/context/WhaleProvider";
import { useDispatch } from "react-redux";
import { stats } from "@/store/stats";

// This StatsProvider component is used to provide stats data from the DeFiChain blockchain
export function StatsProvider(props: PropsWithChildren<{}>): JSX.Element {
  const connection = useNetwork().connection;
  const interval = isPlayground(connection) ? 3000 : 30000;
  const api = useWhaleApiClient();
  const dispatch = useDispatch();

  useEffect(() => {
    function fetch(): void {
      // if blockchain is connected successfully, update both lastSync & lastSuccessfulSync to current date
      void api.stats
        .get()
        .then((data) => {
          dispatch(
            stats.actions.update({
              ...data,
              lastSync: new Date().toString(),
              lastSuccessfulSync: new Date().toString(),
            }),
          );
          dispatch(stats.actions.setConnected(true));
        })
        .catch((err) => {
          dispatch(
            stats.actions.update({
              // if blockchain is not connected successfully, only update value of lastSync to current date
              ...err,
              lastSync: new Date().toString(),
            }),
          );
          dispatch(stats.actions.setConnected(false));
        });
    }

    fetch();
    const intervalId = setInterval(fetch, interval);
    return () => clearInterval(intervalId);
  }, [api, dispatch]);

  return <>{props.children}</>;
}
