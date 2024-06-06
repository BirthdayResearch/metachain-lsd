"use client";

import React, { useEffect, useRef, useState } from "react";
import { WagmiProvider } from "wagmi";
import { ConnectKitProvider } from "connectkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ContractProvider } from "@/context/ContractContext";
import { NetworkEnvironmentProvider } from "@/context/NetworkEnvironmentContext";
import AppHeader from "@/app/app/components/AppHeader";
import AppFooter from "@/app/app/components/AppFooter";
import config from "@/config/wagmiConfig";

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
