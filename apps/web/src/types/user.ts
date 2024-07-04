export const enum SubscriptionStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export interface CreateUserI {
  email: string;
  status?: SubscriptionStatus;
}

export interface GetStats {
  totalShares: string;
  totalAssets: string;
  totalRewards: string;
  mDfiDfiRatio: string;
}
