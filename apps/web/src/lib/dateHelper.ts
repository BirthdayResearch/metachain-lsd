export function formatTimestampToDate(timestamp: BigInt): string {
  const date = new Date(Number(timestamp) * 1000);

  if (!Number.isSafeInteger(Number(timestamp))) {
    return "Timestamp is outside the safe integer range for JavaScript numbers.";
  }

  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  const year = date.getUTCFullYear();

  return `${month}/${day}/${year}`;
}
