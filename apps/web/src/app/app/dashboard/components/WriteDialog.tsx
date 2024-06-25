import { MarbleLsdV1__factory } from "smartcontracts/src";
import ContractMethodForm from "./ContractMethodForm";
import { DashboardWriteMethodI, SmartContractMethod } from "@/lib/types";
import Modal from "./Modal";

interface WriteDialogI {
  isOpen: boolean;
  writeMethod: DashboardWriteMethodI;
  setIsOpen: (val: boolean) => void;
}

export default function WriteDialog({
  isOpen,
  setIsOpen,
  writeMethod,
}: WriteDialogI) {
  const methodDetails = MarbleLsdV1__factory.abi.find(
    ({ name, type }: { name?: string; type: string }) =>
      type === "function" && name === writeMethod?.name,
  );
  return (
    <Modal
      isOpen={isOpen}
      onCloseModal={() => setIsOpen(false)}
      description={writeMethod.description}
      title={(writeMethod?.name ?? "").toUpperCase()}
    >
      <ContractMethodForm method={methodDetails as SmartContractMethod} />
    </Modal>
  );
}
