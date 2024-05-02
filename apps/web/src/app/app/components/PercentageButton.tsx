import BigNumber from "bignumber.js";

export enum AmountButton {
  TwentyFive = "25%",
  Half = "50%",
  SeventyFive = "75%",
  Max = "Max",
}

export function PercentageButton({
  maxAmount,
  onClickRecalculateAmount,
}: {
  maxAmount: BigNumber;
  onClickRecalculateAmount: (amount: string) => void;
}) {
  const decimalPlace = 5;
  const getValue = (percentage: AmountButton) => {
    switch (percentage) {
      case AmountButton.TwentyFive:
        return maxAmount
          .multipliedBy(0.25)
          .toFixed(decimalPlace, BigNumber.ROUND_FLOOR);
      case AmountButton.Half:
        return maxAmount
          .multipliedBy(0.5)
          .toFixed(decimalPlace, BigNumber.ROUND_FLOOR);
      case AmountButton.SeventyFive:
        return maxAmount
          .multipliedBy(0.75)
          .toFixed(decimalPlace, BigNumber.ROUND_FLOOR);
      case AmountButton.Max:
      default:
        return maxAmount.toFixed(decimalPlace, BigNumber.ROUND_FLOOR);
    }
  };

  return (
    <aside className="gap-x-1 flex flex-row rounded-xl bg-light-1000/[0.03] p-1">
      {Object.values(AmountButton).map((type) => (
        <button
          key={type}
          onClick={() => onClickRecalculateAmount(getValue(type))}
          data-testid={`percentage-button-${type}`}
          className="w-full input-gradient-1 rounded-xl py-1 px-3"
        >
          <span className="font-medium text-xs">{type}</span>
        </button>
      ))}
    </aside>
  );
}
