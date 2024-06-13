import * as Joi from "joi";

export const DATABASE_URL = "DATABASE_URL";
import { EnvironmentNetwork } from "@waveshq/walletkit-core";

export function appConfig() {
  return {
    dbUrl: process.env.DATABASE_URL,
    botNetworks: process.env.BOT_RUNNING_NETWORKS,
    defichain: {
      [EnvironmentNetwork.MainNet]: {
        rewardDistributerKey:
          process.env.DEFICHAIN_MAINNET_REWARD_DISTRIBUTER_PK,
        withdrawFinalizerKey:
          process.env.DEFICHAIN_MAINNET_WITHDRAW_FINALIZER_PK,
        ethRPCUrl: "https://eth.mainnet.ocean.jellyfishsdk.com",
      },
      [EnvironmentNetwork.TestNet]: {
        rewardDistributerKey:
          process.env.DEFICHAIN_TESTNET_REWARD_DISTRIBUTER_PK,
        withdrawFinalizerKey:
          process.env.DEFICHAIN_TESTNET_WITHDRAW_FINALIZER_PK,
        marbleFiContractAddress: "0x0B52a71A03a47246BD9d9C556B6Df9C42e73462A",
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
