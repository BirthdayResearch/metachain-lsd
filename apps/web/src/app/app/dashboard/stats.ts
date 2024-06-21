import BigNumber from "bignumber.js";
import { formatEther, parseEther } from "ethers";

const stats = [
  {
    functionName: "totalStakedAssets",
    format: (value: string) => formatEther(value).toString(),
    label: "Total Staked Assets",
  },
  {
    functionName: "totalShares",
    format: (value: string) => formatEther(value).toString(),
    label: "mDFI Total Supply",
  },
  {
    functionName: "totalAssets",
    format: (value: string) => formatEther(value).toString(),
    label: "Total Assets (Staked + Rewards)",
  },
  {
    functionName: "totalRewardAssets",
    format: (value: string) => formatEther(value).toString(),
    label: "Total Reward Assets",
  },
  {
    functionName: "getAvailableFundsToFlush",
    format: (value: string) => formatEther(value).toString(),
    label: "Available For Withdrawal",
    writeMethod: {
      name: "flushFunds",
      description: "To flush the excess funds to wallet address",
    },
  },
  {
    functionName: "convertToAssets",
    label: "mDFI-DFI Ratio",
    format: (value: string) => formatEther(value).toString(),
    args: [parseEther("1")],
  },
  {
    functionName: "minDeposit",
    format: (value: string) => formatEther(value).toString(),
    label: "Minimum Deposit",
  },
  {
    functionName: "minWithdrawal",
    format: (value: string) => formatEther(value).toString(),
    label: "Minimum Withdrawal",
  },
  {
    functionName: "lastFinalizedRequestId",
    decimal: 0,
    label: "Last Finalized Req No",
  },
  {
    functionName: "lastRequestId",
    decimal: 0,
    label: "Withdrawal Req No",
  },
  {
    functionName: "unfinalizedRequestNumber",
    decimal: 0,
    label: "Non finalized requests in the queue",
  },
  {
    functionName: "unfinalizedAssets",
    format: (values: string[]) => {
      const [amount] = values;
      return formatEther(amount).toString();
    },
    label: "DFI yet to be finalized",
    writeMethod: {
      name: "finalize",
      role: ["FINALIZE_ROLE"],
      description:
        "Assets to finalize all the requests should be calculated using `prefinalize()` and sent along, use Non finalized requests in the queue value and DFI yet to be finalized as input",
    },
  },
  {
    functionName: "lockedAssets",
    format: (value: string) => formatEther(value).toString(),
    decimal: 0,
    label: "Locked Assets",
  },
  {
    functionName: "mintingFees",
    decimal: 2,
    suffix: "%",
    format: (value: string) => new BigNumber(value).dividedBy(100).toString(),
    label: "Minting Fees",
  },
  {
    functionName: "performanceFees",
    decimal: 2,
    suffix: "%",
    format: (value: string) => new BigNumber(value).dividedBy(100).toString(),
    label: "Performance Fees",
  },
  {
    functionName: "redemptionFees",
    decimal: 2,
    suffix: "%",
    format: (value: string) => new BigNumber(value).dividedBy(100).toString(),
    label: "Redemption Fees",
  },
  {
    functionName: "isDepositPaused",
    label: "Deposit Paused",
    writeMethod: {
      name: "setDepositPaused",
      role: ["ADMINISTRATOR_ROLE"],
    },
  },
  {
    functionName: "isWithdrawalPaused",
    label: "Withdrawal Paused",
    writeMethod: {
      name: "setWithdrawalPaused",
      role: ["ADMINISTRATOR_ROLE"],
    },
  },
];

export default stats;
