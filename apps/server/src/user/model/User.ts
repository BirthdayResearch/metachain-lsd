import { SubscriptionStatus } from "@prisma/client";

export type createUserParams = {
  email: string;
  status?: SubscriptionStatus;
};
