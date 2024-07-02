"use client";

import React, { useEffect, useState } from "react";

import { WagmiProvider } from "wagmi";
import config from "@/config/wagmiConfig";
import { ConnectKitProvider } from "connectkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ContractProvider } from "@/context/ContractContext";
import { NetworkEnvironmentProvider } from "@/context/NetworkEnvironmentContext";

export default function AppProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = new QueryClient();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider options={{ initialChainId: 0 }}>
          {mounted && (
            <NetworkEnvironmentProvider>
              <ContractProvider>{children}</ContractProvider>
            </NetworkEnvironmentProvider>
          )}
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
