export const enum SubscriptionStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export interface CreateUserI {
  email: string;
  status?: SubscriptionStatus;
}
