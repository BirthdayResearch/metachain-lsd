import { CreateConfigParameters, createConfig, http } from "wagmi";
import { getDefaultConfig } from "connectkit";
import { sepolia, defichainEvm, defichainEvmTestnet } from "wagmi/chains";
import { walletConnect } from "wagmi/connectors";

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
    connectors: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID
      ? [
          walletConnect({
            projectId: process.env
              .NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID as string,
            showQrModal: false,
          }),
        ]
      : [],
    chains: [DefichainEvmMainnet, DefichainEvmTestnet],
    transports: {
      [DefichainEvmMainnet.id]: http(
        DefichainEvmMainnet.rpcUrls.default.http[0],
      ),
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
