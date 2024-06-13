import BigNumber from "bignumber.js";
import { parseEther } from "ethers";

export function truncateTextFromMiddle(text: string, length = 5): string {
  const maxLength = length * 2;

  if (text.length <= length || text.length <= maxLength) {
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

export const getDecimalPlace = (value: string | BigNumber | number): number => {
  if (new BigNumber(value).eq(0) || new BigNumber(value).gte(1)) {
    return 2;
  }
  return 5;
};
