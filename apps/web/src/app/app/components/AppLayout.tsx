"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  CreateConfigParameters,
  WagmiProvider,
  createConfig,
  http,
} from "wagmi";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { sepolia, defichainEvm, defichainEvmTestnet } from "wagmi/chains";
import { ContractProvider } from "@/context/ContractContext";
import { NetworkEnvironmentProvider } from "@/context/NetworkEnvironmentContext";
import AppHeader from "@/app/app/components/AppHeader";
import AppFooter from "@/app/app/components/AppFooter";

const DefichainEvmMainnet = {
  ...defichainEvm,
  nativeCurrency: {
    ...defichainEvm.nativeCurrency,
    decimals: 18,
  },
};
const DefichainEvmTestnet = {
  ...defichainEvmTestnet,
  nativeCurrency: {
    ...defichainEvmTestnet.nativeCurrency,
    decimals: 18,
  },
};

const config = createConfig(
  // TODO remove this on mainnet Prod launch
  getDefaultConfig({
    // Your dApps chains
    chains:
      process.env.NODE_ENV === "development"
        ? [sepolia, DefichainEvmMainnet, DefichainEvmTestnet]
        : [DefichainEvmTestnet],
    transports:
      process.env.NODE_ENV === "development"
        ? {
            [sepolia.id]: http(sepolia.rpcUrls.default.http[0]),
            [DefichainEvmMainnet.id]: http(
              DefichainEvmMainnet.rpcUrls.default.http[0],
            ),
            [DefichainEvmTestnet.id]: http(
              DefichainEvmTestnet.rpcUrls.default.http[0],
            ),
          }
        : {
            [DefichainEvmTestnet.id]: http(
              DefichainEvmTestnet.rpcUrls.default.http[0],
            ),
          },

    // Required API Keys
    walletConnectProjectId: process.env
      .NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID as string,

    // Required App Info
    appName: "MarbleFi",

    // Optional App Info
    appDescription:
      "Marble gives you the most exciting opportunities for your DFI.",
  }) as CreateConfigParameters,
);

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const contentRef = useRef<HTMLDivElement>(null);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const queryClient = new QueryClient();

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider options={{ initialChainId: 0 }}>
          {mounted && (
            <NetworkEnvironmentProvider>
              <ContractProvider>
                <div
                  ref={contentRef}
                  className="flex w-full min-h-screen flex-col items-center text-light-1000"
                >
                  <AppHeader />
                  <div className="w-full flex-grow">{children}</div>
                  <AppFooter />
                </div>
              </ContractProvider>
            </NetworkEnvironmentProvider>
          )}
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
