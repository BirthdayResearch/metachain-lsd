import NumericFormat, {
  NumericFormatProps,
} from "../../../components/NumericFormat";
import clsx from "clsx";

export function NumericTransactionRow({
  label,
  comment,
  value,
  customStyle,
}: {
  label: string;
  comment?: string;
  value: NumericFormatProps;
  customStyle?: string;
}) {
  return (
    <div
      className={clsx(
        "flex flex-row justify-between py-2 flex-1 text-wrap",
        customStyle,
      )}
    >
      <div>
        <span className="text-xs md:text-sm">{label}</span>
        {comment && (
          <span className="text-xs md:text-sm ml-1 text-dark-00/70">
            {comment}
          </span>
        )}
      </div>
      <NumericFormat className="text-sm font-semibold text-right" {...value} />
    </div>
  );
}
