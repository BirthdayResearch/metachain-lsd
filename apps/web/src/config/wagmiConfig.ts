import { CreateConfigParameters, createConfig, http } from "wagmi";
import { getDefaultConfig } from "connectkit";
import { sepolia, defichainEvm, defichainEvmTestnet } from "wagmi/chains";

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

export default config;
