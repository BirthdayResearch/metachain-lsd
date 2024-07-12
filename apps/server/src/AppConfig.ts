import * as Joi from "joi";

export const DATABASE_URL = "DATABASE_URL";
import { EnvironmentNetwork } from "@waveshq/walletkit-core";

export function appConfig() {
  return {
    dbUrl: process.env.DATABASE_URL,
    botNetworks: process.env.BOT_RUNNING_NETWORKS,
    defichain: {
      [EnvironmentNetwork.MainNet]: {
        rewardDistributerKey: process.env.DEFICHAIN_MAINNET_PRIVATE_KEY,
        marbleFiContractDeploymentHash:
          "0xfb6913340f29733a14917879dc1e2ed9572a28f6b69f8c80d7ec2b2472cc5342",
        ethRPCUrl: "https://eth.mainnet.ocean.jellyfishsdk.com",
      },
      [EnvironmentNetwork.TestNet]: {
        rewardDistributerKey: process.env.DEFICHAIN_TESTNET_PRIVATE_KEY,
        marbleFiContractAddress: "0x0B52a71A03a47246BD9d9C556B6Df9C42e73462A",
        marbleFiContractDeploymentHash:
          "0x85d8112666b6a18041a6beb3d71832807403ed7915f35c382317ee5024dfe575",
        ethRPCUrl: "https://eth.testnet.ocean.jellyfishsdk.com",
      },
      whaleURL: process.env.DEFICHAIN_WHALE_URL,
    },
  };
}

export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;
export type AppConfig = DeepPartial<ReturnType<typeof appConfig>>;

export const ENV_VALIDATION_SCHEMA = Joi.object({
  DATABASE_URL: Joi.string(),
});
