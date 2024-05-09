"use client";

import React, { useEffect, useRef, useState } from "react";
import { WagmiProvider, createConfig, http } from "wagmi";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { sepolia, defichainEvm, defichainEvmTestnet } from "wagmi/chains";
import SecuredStoreAPI from "@/api/secure-storage";
import Logging from "@/api/logging";
import {
  NetworkProvider as WhaleNetworkProvider,
  WhaleProvider,
} from "@waveshq/walletkit-ui";
import { ContractProvider } from "@/context/ContractContext";
import { NetworkEnvironmentProvider } from "@/context/NetworkEnvironmentContext";
import AppHeader from "@/app/app/components/AppHeader";
import AppFooter from "@/app/app/components/AppFooter";

const config = createConfig(
  getDefaultConfig({
    // Your dApps chains
    chains: [sepolia, defichainEvm, defichainEvmTestnet],
    transports: {
      [sepolia.id]: http(sepolia.rpcUrls.default.http[0]),
      [defichainEvm.id]: http(defichainEvm.rpcUrls.default.http[0]),
      [defichainEvmTestnet.id]: http(
        defichainEvmTestnet.rpcUrls.default.http[0],
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
  }),
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
            <WhaleNetworkProvider api={SecuredStoreAPI} logger={Logging}>
              <WhaleProvider>
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
              </WhaleProvider>
            </WhaleNetworkProvider>
          )}
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
