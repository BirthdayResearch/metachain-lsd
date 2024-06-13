import BigNumber from "bignumber.js";

export interface NumericFormatProps extends BigNumber.Format {
  value: string | number | BigNumber;
  className?: string;
  thousandSeparator?: boolean;
  decimalScale?: number;
  trimTrailingZeros?: boolean;
  testId?: string;
}

export default function NumericFormat({
  value,
  className,
  prefix = "",
  suffix = "",
  thousandSeparator,
  decimalScale = 8,
  trimTrailingZeros = true,
  testId,
}: NumericFormatProps): JSX.Element {
  const fmt: BigNumber.Format = {
    prefix,
    suffix: ` ${suffix}`, // add space before suffix
    decimalSeparator: ".",
    groupSeparator: thousandSeparator ? "," : "",
    groupSize: thousandSeparator ? 3 : 0,
  };

  let formattedNumber = new BigNumber(value).toFormat(decimalScale, fmt);

  if (trimTrailingZeros) {
    // If the value is 0, return '0.00'
    if (new BigNumber(value).isEqualTo(0)) {
      formattedNumber = "0.00";
    } else {
      // split the formatted # by space to separate the number and suffix
      const parts = formattedNumber.split(" ");
      // remove trailing zeros and decimal point if there are no digits after it
      const num = parts[0].replace(/\.?0+$/, "");
      // join the number and suffix back together
      formattedNumber = `${num} ${parts[1]}`;
    }
  }

  return (
    <span
      className={className}
      data-testid={testId}
      title={value ? new BigNumber(value).toString() : ""}
    >
      {formattedNumber}
    </span>
  );
}
