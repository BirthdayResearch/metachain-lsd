import { useEffect, useState } from "react";
import Dropdown from "./Dropdown";
import Modal from "./Modal";
import InputComponent from "./InputComponent";
import { CTAButton } from "@/components/button/CTAButton";

export default function AddZeroesModal({
  isOpen,
  onCloseModal,
  onAdd,
}: {
  isOpen: boolean;
  onCloseModal: () => void;
  onAdd: (selected: string) => void;
}) {
  const [selected, setSelected] = useState({ label: "", value: "" });
  const [error, setError] = useState("");
  const [customDecimal, setCustomDecimal] = useState<string | number>("");
  const decimals = [
    { label: "6", value: "6" },
    { label: "8", value: "8" },
    { label: "16", value: "16" },
    { label: "18", value: "18" },
    { label: "Custom", value: "custom" },
  ];

  const resetForm = () => {
    // Added timeout to prevent text flicker (wait for ui transitions)
    setTimeout(() => {
      setSelected({ label: "", value: "" });
      setCustomDecimal("");
    }, 300);
  };

  const handleAddButton = () => {
    const ZERO = "0";
    let numberOfZeroes = Number(selected.value);
    if (selected.value === "custom") {
      numberOfZeroes = Number(customDecimal ?? 0);
    }
    onAdd(ZERO.repeat(numberOfZeroes));
    resetForm();
  };

  const handleModalClose = () => {
    resetForm();
    onCloseModal();
  };

  useEffect(() => {
    const MAX_ALLOWED = 20;
    if (Number(customDecimal) > MAX_ALLOWED) {
      setError(`Exceeded maximum value allowed of ${MAX_ALLOWED}`);
    } else {
      setError("");
    }
  }, [customDecimal]);

  return (
    <Modal title="Add Zeroes" isOpen={isOpen} onCloseModal={handleModalClose}>
      <Dropdown
        value={selected}
        placeholder="Select"
        options={decimals}
        onChange={setSelected}
        dropdownContainerClassName="!py-2 cursor-pointer"
        labelClass="!text-base"
      />
      {selected.value === "custom" && (
        <>
          <InputComponent
            type="number"
            value={customDecimal}
            setValue={setCustomDecimal}
            placeholder=""
            inputClass="!text-sm"
            inputContainerClassName="!py-2 mt-4"
            error={error}
            errorClass="text-xxs text-red"
          />
          {!error && (
            <div className="text-xs text-light-700 mt-2">
              Enter the number of zeroes to add. Example: 3 to add three (000)
              zeroes.
            </div>
          )}
        </>
      )}
      <div className="mt-5 text-center">
        <CTAButton
          label="Add"
          testID="add-zeroes-button"
          onClick={() => handleAddButton()}
          isDisabled={!!error}
        />
      </div>
    </Modal>
  );
}
