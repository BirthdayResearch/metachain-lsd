import BigNumber from "bignumber.js";
import { parseEther } from "ethers";

export function truncateTextFromMiddle(text: string, length = 5): string {
  if (text.length <= length) {
    return text;
  }
  return `${text.substring(0, length)}...${text.substring(
    text.length - length,
    text.length,
  )}`;
}

export function toWei(amount: string | BigNumber): string {
  return parseEther(new BigNumber(amount ?? 0).toFixed(18)).toString();
}

// To convert USD amount to either 2 or 5 decimal places
export const getDecimalPlace = (value: string | BigNumber | number): number => {
  if (new BigNumber(value).eq(0) || new BigNumber(value).gte(1)) {
    return 2;
  }
  return 5;
};
