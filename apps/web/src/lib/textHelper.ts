import BigNumber from "bignumber.js";
import { parseEther } from "ethers";

export default function truncateTextFromMiddle(
  text: string,
  length = 5,
): string {
  if (text.length <= length) {
    return text;
  }
  return `${text.substring(0, length)}...${text.substring(
    text.length - length,
    text.length,
  )}`;
}

export function toWei(amount: string | BigNumber): string {
  return parseEther(new BigNumber(amount).toFixed(18)).toString();
}
