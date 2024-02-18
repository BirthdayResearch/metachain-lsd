"use client";

import type { Metadata } from "next";
import "../../globals.css";
import Header from "@/app/ui/components/Header";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { sepolia, mainnet } from "wagmi/chains";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { publicProvider } from "wagmi/providers/public";
import { ETHEREUM_MAINNET_ID } from "@/app/lib/constants";
import { MAINNET_CONFIG, TESTNET_CONFIG } from "@/index";

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

export default function ContainerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // <html lang="en">
    <WagmiConfig config={config}>
      <ConnectKitProvider options={{ initialChainId: 0 }}>
        <div className="flex min-h-screen flex-col items-center w-full p-10">
          <Header />
          {children}
        </div>
      </ConnectKitProvider>
    </WagmiConfig>
    // </html>
  );
}
