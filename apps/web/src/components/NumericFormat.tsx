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
  // trimTrailingZeros,
  testId,
}: NumericFormatProps): JSX.Element {
  const fmt: BigNumber.Format = {
    prefix,
    suffix,
    decimalSeparator: ".",
    groupSeparator: thousandSeparator ? "," : "",
    groupSize: thousandSeparator ? 3 : 0,
  };

  let formattedNumber = new BigNumber(value).toFormat(decimalScale, fmt);
  // TODO incorrect logic Fix this
  // if (trimTrailingZeros) {
  //   const num = formattedNumber.split(" ")[0].replace(/\.?0+$/, "");
  //   formattedNumber = `${num} ${suffix}`;
  // }

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
