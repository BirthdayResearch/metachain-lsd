"use client";

import type { Metadata } from "next";
import "../../globals.css";
import Header from "@/app/ui/components/header/Header";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { sepolia, mainnet } from "wagmi/chains";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { publicProvider } from "wagmi/providers/public";
import { ETHEREUM_MAINNET_ID } from "@/app/lib/constants";
import { MAINNET_CONFIG, TESTNET_CONFIG } from "@/index";
import { Montserrat } from "next/font/google";
import { Next13ProgressBar } from "next13-progressbar";
import {
  NetworkProvider as WhaleNetworkProvider,
  WhaleProvider,
} from "@waveshq/walletkit-ui";
import SecuredStoreAPI from "../../../api/secure-storage";
import Logging from "@/api/logging";
import { ContractProvider } from "@/app/lib/context/ContractContext";
import { NetworkEnvironmentProvider } from "@/app/lib/context/NetworkEnvironmentContext";
import React, { useRef, useState, useEffect } from "react";
import Footer from "@/app/ui/components/Footer";

export const metadata: Metadata = {
  title: "MarbleFI",
  description: "LSD protocol",
};

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

const inter = Montserrat({ subsets: ["latin"] });

export default function ContainerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const contentRef = useRef<HTMLDivElement>(null);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <html lang="en">
      <body
        className={`${inter.className} absolute top-0 left-0 z-auto h-full w-full bg-cover bg-no-repeat bg-clip-border bg-[url('/background-mobile-375.svg')] md:bg-[url('/background-web-1440.svg')]`}
      >
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
                        <Header parentReference={contentRef} />
                        <div className="mx-5 md:mx-12">{children}</div>
                        <Next13ProgressBar
                          height="4px"
                          color="#69FF23"
                          options={{ showSpinner: true }}
                          showOnShallow
                        />
                        <Footer parentReference={contentRef} />
                      </div>
                    </ContractProvider>
                  </NetworkEnvironmentProvider>
                </WhaleProvider>
              </WhaleNetworkProvider>
            )}
          </ConnectKitProvider>
        </WagmiConfig>
      </body>
    </html>
  );
}
