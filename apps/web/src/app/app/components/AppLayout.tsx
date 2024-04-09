"use client";

import React, { useEffect, useRef, useState } from "react";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { mainnet, sepolia } from "wagmi/chains";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { ETHEREUM_MAINNET_ID } from "@/lib/constants";
import { MAINNET_CONFIG, TESTNET_CONFIG } from "@/index";
import { publicProvider } from "wagmi/providers/public";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import SecuredStoreAPI from "@/api/secure-storage";
import Logging from "@/api/logging";
import {
  NetworkProvider as WhaleNetworkProvider,
  WhaleProvider,
} from "@waveshq/walletkit-ui";
import { ContractProvider } from "@/context/ContractContext";
import { NetworkEnvironmentProvider } from "@/context/NetworkEnvironmentContext";
import AppHeader from "@/app/app/components/AppHeader";

const metamask = new MetaMaskConnector({
  chains: [mainnet, sepolia],
});

const { chains } = configureChains(
  [sepolia, mainnet],
  [
    jsonRpcProvider({
      rpc: (chain) => {
        const isMainNet = chain.id === ETHEREUM_MAINNET_ID;
        const config = isMainNet ? MAINNET_CONFIG : TESTNET_CONFIG;
        return {
          http: (config.EthereumRpcUrl || chain.rpcUrls.default) as string,
        };
      },
    }),
    publicProvider(),
  ],
);

const config = createConfig(
  getDefaultConfig({
    autoConnect: true,
    chains,
    appName: "marblefi",
    connectors: [metamask],
    walletConnectProjectId:
      process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? "",
  }),
);

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const contentRef = useRef<HTMLDivElement>(null);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <WagmiConfig config={config}>
      <ConnectKitProvider options={{ initialChainId: 0 }}>
        {mounted && (
          <WhaleNetworkProvider api={SecuredStoreAPI} logger={Logging}>
            <WhaleProvider>
              <NetworkEnvironmentProvider>
                <ContractProvider>
                  <div
                    ref={contentRef}
                    className="flex min-h-screen flex-col items-center pb-8 text-light-1000"
                  >
                    <AppHeader />
                    <section className="mx-5 md:mx-12 w-full">
                      {children}
                    </section>
                  </div>
                </ContractProvider>
              </NetworkEnvironmentProvider>
            </WhaleProvider>
          </WhaleNetworkProvider>
        )}
      </ConnectKitProvider>
    </WagmiConfig>
  );
}
