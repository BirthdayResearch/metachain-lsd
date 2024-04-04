import { WhaleApiClient } from "@defichain/whale-api-client";
import { useEffect, useState } from "react";
import { PriceTicker } from "@defichain/whale-api-client/dist/api/prices";
import BigNumber from "bignumber.js";

export function useDfiPrice(): BigNumber {
  const [dfiPrice, setDfiPrice] = useState<PriceTicker | null>(null);

  const fetchDfiPrice = () => {
    const whaleApiClient = new WhaleApiClient({ network: "mainnet" });
    whaleApiClient.prices
      .get("DFI", "USD")
      .then((price) => {
        setDfiPrice(price);
      })
      .catch((error) => {
        console.error("Failed to fetch DFI price", error);
      });
  };

  useEffect(() => {
    fetchDfiPrice();
  }, []);

  return new BigNumber(dfiPrice?.price.aggregated.amount ?? 0);
}
