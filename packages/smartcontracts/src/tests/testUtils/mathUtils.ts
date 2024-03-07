import { BigNumberish, parseEther } from 'ethers';
import BigNumber from 'bignumber.js';

export function toWei(amount: string): BigNumberish {
  return parseEther(amount);
}

// Current time stamp
export function getCurrentTimeStamp({ additionalTime }: GetTimestampOptions = {}): number {
  // Current timestamp in seconds
  if (additionalTime !== undefined) {
    return Math.floor(Date.now() / 1000) + additionalTime;
  }
  return Math.floor(Date.now() / 1000);
}

interface GetTimestampOptions {
  additionalTime?: number;
}

export function feesOnRaw(amount: string, feeBasisPoints: string): BigNumber {
  return new BigNumber(amount).multipliedBy(feeBasisPoints).dividedBy(10000).integerValue(BigNumber.ROUND_UP);
}

export function feesOnTotal(amount: string, feeBasisPoints: string): BigNumber {
  return new BigNumber(amount)
    .multipliedBy(feeBasisPoints)
    .dividedBy(new BigNumber(feeBasisPoints).plus(10000))
    .integerValue(BigNumber.ROUND_UP);
}
