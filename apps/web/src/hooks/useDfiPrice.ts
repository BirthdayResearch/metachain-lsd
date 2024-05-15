import { WhaleApiClient } from "@defichain/whale-api-client";
import { useEffect, useState } from "react";
import BigNumber from "bignumber.js";

export function useDfiPrice(): BigNumber {
  const [dfiPrice, setDfiPrice] = useState<number>(0);

  const fetchDfiPrice = () => {
    const whaleApiClient = new WhaleApiClient({ network: "mainnet" });
    whaleApiClient.stats
      .get()
      .then(({ price }) => {
        setDfiPrice(price.usd);
      })
      .catch((error) => {
        console.error("Failed to fetch DFI price", error);
      });
  };

  useEffect(() => {
    fetchDfiPrice();
  }, []);

  return new BigNumber(dfiPrice ?? 0);
}
