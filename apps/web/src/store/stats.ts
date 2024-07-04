import { StatsData } from "@defichain/whale-api-client/dist/api/stats";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { formatISO } from "date-fns";

export interface StatsState {
  count: {
    blocks?: number;
    tokens?: number;
    prices?: number;
    masternodes?: number;
  };
  tvl: {
    total?: number;
    dex?: number;
    loan?: number;
    masternodes?: number;
  };
  burned: {
    total?: number;
    fee?: number;
    emission?: number;
    address?: number;
  };
  price: {
    usd?: number;
  };
  masternodes: {
    locked?: Array<{
      weeks: number;
      tvl: number;
      count: number;
    }>;
  };
  emission: {
    total?: number;
    masternode?: number;
    dex?: number;
    community?: number;
    anchor?: number;
    burned?: number;
  };
  blockchain: {
    difficulty?: number;
  };
  net: {
    version?: number;
    subversion?: string;
    protocolversion?: number;
  };
  loan: {
    count?: {
      collateralTokens: number;
      loanTokens: number;
      openAuctions: number;
      openVaults: number;
      schemes: number;
    };
    value?: {
      collateral: number;
      loan: number;
    };
  };
  updatedAt: string;
  connected: boolean;
  lastSync?: string;
  lastSuccessfulSync?: string;
}

const initialState: StatsState = {
  count: {},
  tvl: {},
  burned: {},
  price: {},
  masternodes: {},
  emission: {},
  blockchain: {},
  net: {},
  loan: {},
  updatedAt: formatISO(Date.now(), { representation: "time" }),
  connected: false,
  lastSync: undefined,
  lastSuccessfulSync: undefined,
};

export const stats = createSlice({
  name: "stats",
  initialState,
  reducers: {
    update: (
      state,
      action: PayloadAction<
        StatsData & { lastSuccessfulSync?: string; lastSync?: string }
      >,
    ) => {
      state.count = action.payload.count;
      state.tvl = action.payload.tvl;
      state.burned = action.payload.burned;
      state.price = action.payload.price;
      state.masternodes = action.payload.masternodes;
      state.emission = action.payload.emission;
      state.blockchain = action.payload.blockchain;
      state.net = action.payload.net;
      state.loan = action.payload.loan;
      state.updatedAt = formatISO(Date.now(), { representation: "time" });
      const firstSuccessfulSync =
        state.lastSuccessfulSync ?? new Date().toString();
      state.lastSuccessfulSync =
        action.payload.lastSuccessfulSync != null
          ? action.payload.lastSuccessfulSync
          : firstSuccessfulSync;
      state.lastSync = action.payload.lastSync; // updated even if its not successful (no connection)
    },
    setConnected: (state, action: PayloadAction<boolean>) => {
      state.connected = action.payload;
    },
  },
});
