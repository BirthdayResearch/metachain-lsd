"use client";

import type { Metadata } from "next";
import "../globals.css";
import Header from "@/components/Header";
import { http, createConfig, WagmiProvider } from "wagmi";
import {
  sepolia,
  mainnet,
  defichainEvm,
  defichainEvmTestnet,
} from "wagmi/chains";
import { injected } from "wagmi/connectors";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ETHEREUM_MAINNET_ID } from "@/lib/constants";
import { MAINNET_CONFIG, TESTNET_CONFIG } from "@/index";
import { Montserrat } from "next/font/google";
import { Next13ProgressBar } from "next13-progressbar";
import {
  NetworkProvider as WhaleNetworkProvider,
  WhaleProvider,
} from "@waveshq/walletkit-ui";
import SecuredStoreAPI from "../api/secure-storage";
import Logging from "@/api/logging";
import { ContractProvider } from "@/context/ContractContext";
import { NetworkEnvironmentProvider } from "@/context/NetworkEnvironmentContext";
import React, { useRef, useState, useEffect } from "react";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "MarbleFI",
  description: "LSD protocol",
};
const metamask = injected({ target: "metaMask" });

// const { chains } = configureChains(
//   [sepolia, defichainEvm, defichainEvmTestnet],
//   [
//     jsonRpcProvider({
//       rpc: (chain) => {
//         const isMainNet = chain.id === ETHEREUM_MAINNET_ID;
//         const config = isMainNet ? MAINNET_CONFIG : TESTNET_CONFIG;
//         return {
//           http: (config.EthereumRpcUrl || chain.rpcUrls.default) as string,
//         };
//       },
//     }),
//     publicProvider(),
//   ],
// );

// const config = createConfig(
//   getDefaultConfig({
//     autoConnect: true,
//     chains:[sepolia, defichainEvm, defichainEvmTestnet],
//     // appName: "marblefi",
//     // connectors: [metamask],
//     // walletConnectProjectId:
//     //   process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? "",
//   transports: {
//       [sepolia.id]: http(sepolia.rpcUrls.default.http[0]),
//       [defichainEvm.id]: http(defichainEvm.rpcUrls.default.http[0]),
//       [defichainEvmTestnet.id]: http(defichainEvmTestnet.rpcUrls.default.http[0]),
//   },
//   }),
// );

const chains = [sepolia, defichainEvm, defichainEvmTestnet];

const config = createConfig(
  getDefaultConfig({
    chains: [sepolia, defichainEvm, defichainEvmTestnet],
    appName: "marblefi",
    walletConnectProjectId:
      process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? "",
    connectors: [metamask],
    // transports: {
    //     [sepolia.id]: http(sepolia.rpcUrls.default.http[0]),
    //     [defichainEvm.id]: http(defichainEvm.rpcUrls.default.http[0]),
    //     [defichainEvmTestnet.id]: http(defichainEvmTestnet.rpcUrls.default.http[0]),
    // }
  }),
);
// const config = createConfig(
//     getDefaultConfig({
//         autoConnect: true,
//         chains,
//         appName: "marblefi",
//         connectors: [metamask],
//         walletConnectProjectId:
//             process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? "",
//         client: {
//             publicClient: null, // Provide the appropriate value here if needed
//             transports: {
//                 [sepolia.id]: http(sepolia.rpcUrls.default.http[0]),
//                 [defichainEvm.id]: http(defichainEvm.rpcUrls.default.http[0]),
//                 [defichainEvmTestnet.id]: http(defichainEvmTestnet.rpcUrls.default.http[0]),
//             },
//         },
//     }),
// );

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

  const queryClient = new QueryClient();

  return (
    <html lang="en">
      <body
        className={`${inter.className} absolute top-0 left-0 z-auto h-full w-full bg-cover bg-no-repeat bg-clip-border bg-[url('/background-mobile-375.svg')] md:bg-[url('/background-web-1440.svg')]`}
      >
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <ConnectKitProvider options={{ initialChainId: 0 }}>
              {mounted && (
                <WhaleNetworkProvider api={SecuredStoreAPI} logger={Logging}>
                  <WhaleProvider>
                    <NetworkEnvironmentProvider>
                      <ContractProvider>
                        <div
                          ref={contentRef}
                          className="flex min-h-screen flex-col items-center w-full px-5 py-8 md:p-12 text-light-1000"
                        >
                          <Header parentReference={contentRef} />
                          {children}
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
          </QueryClientProvider>
        </WagmiProvider>
      </body>
    </html>
  );
}
