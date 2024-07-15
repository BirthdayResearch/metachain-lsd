import { format } from "date-fns";

export function formatTimestampToDate(timestamp: BigInt): string {
  const date = new Date(Number(timestamp) * 1000);

  if (!Number.isSafeInteger(Number(timestamp))) {
    return "Timestamp is outside the safe integer range for JavaScript numbers.";
  }

  return format(date, "MM/dd/yyyy");
}
