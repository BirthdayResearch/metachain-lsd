import { BigNumberish, parseEther } from "ethers";

export function toWei(amount: string): BigNumberish {
  return parseEther(amount);
}

// Current time stamp
export function getCurrentTimeStamp({
  additionalTime,
}: GetTimestampOptions = {}): number {
  // Current timestamp in seconds
  if (additionalTime !== undefined) {
    return Math.floor(Date.now() / 1000) + additionalTime;
  }
  return Math.floor(Date.now() / 1000);
}

interface GetTimestampOptions {
  additionalTime?: number;
}
