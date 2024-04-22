import BigNumber from "bignumber.js";

export enum AmountButton {
  TwentyFive = "25%",
  Half = "50%",
  SeventyFive = "75%",
  Max = "Max",
}

export function PercentageButton({
  percentage,
  maxStakeAmount,
  onClickRecalculateAmount,
}: {
  percentage: string;
  maxStakeAmount: BigNumber;
  onClickRecalculateAmount: (amount: string) => void;
}) {
  const decimalPlace = 5;
  let value = maxStakeAmount.toFixed(decimalPlace, BigNumber.ROUND_FLOOR);

  switch (percentage) {
    case AmountButton.TwentyFive:
      value = maxStakeAmount
        .multipliedBy(0.25)
        .toFixed(decimalPlace, BigNumber.ROUND_FLOOR);
      break;
    case AmountButton.Half:
      value = maxStakeAmount
        .multipliedBy(0.5)
        .toFixed(decimalPlace, BigNumber.ROUND_FLOOR);
      break;
    case AmountButton.SeventyFive:
      value = maxStakeAmount
        .multipliedBy(0.75)
        .toFixed(decimalPlace, BigNumber.ROUND_FLOOR);
      break;
    case AmountButton.Max:
    default:
      value = maxStakeAmount.toFixed(decimalPlace, BigNumber.ROUND_FLOOR);
      break;
  }

  return (
    <button
      onClick={() => onClickRecalculateAmount(value)}
      data-testid={`percentage-button-${percentage}`}
      className="p-1 w-full"
    >
      <span className="font-medium text-xs px-4 py-2">{percentage}</span>
    </button>
  );
}
