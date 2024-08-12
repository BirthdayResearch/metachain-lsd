import PendingIcon from "@/app/app/components/icons/PendingIcon";
import ConfirmedIcon from "@/app/app/components/icons/ConfirmedIcon";

enum Status {
  PENDING = "Pending",
}

export default function StatusBadge({ status }: { status: string }) {
  return (
    <>
      {status === Status.PENDING ? (
        <PendingIcon className="w-4 h-4" />
      ) : (
        <ConfirmedIcon className="w-4 h-4" />
      )}
    </>
  );
}
