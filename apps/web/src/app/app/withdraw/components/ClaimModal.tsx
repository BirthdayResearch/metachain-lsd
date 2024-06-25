import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { CTAButton } from "@/components/button/CTAButton";
import { getDecimalPlace, toWei } from "@/lib/textHelper";
import { NumericTransactionRow } from "@/app/app/components/NumericTransactionRow";
import { Interface, InterfaceAbi } from "ethers";
import { useGetTxnCost } from "@/hooks/useGetTxnCost";
import { useContractContext } from "@/context/ContractContext";

export default function ClaimModal({
  withdrawAmount,
}: {
  withdrawAmount: string;
}) {
  const { MarbleLsdProxy } = useContractContext();
  const [isOpen, setIsOpen] = useState(true);

  function handleOnClick() {
    setIsOpen(!isOpen);
  }

  const data = new Interface(
    MarbleLsdProxy.abi as InterfaceAbi,
  ).encodeFunctionData("requestRedeem", [
    toWei(withdrawAmount),
    MarbleLsdProxy.address,
  ]) as `0x${string}`;

  const { txnCost } = useGetTxnCost(data);

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center">
        <button
          type="button"
          onClick={handleOnClick}
          className="rounded-md bg-black/20 px-4 py-2 text-sm font-medium text-white hover:bg-black/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75"
        >
          Open dialog
        </button>
      </div>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={handleOnClick}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-12 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title className="text-2xl font-semibold leading-7">
                    Claim DFI
                  </Dialog.Title>
                  <IoMdClose
                    size={24}
                    onClick={handleOnClick}
                    className="absolute right-8 top-8 text-light-1000 cursor-pointer"
                  />
                  <div className="mt-2">
                    <p className="text-sm">
                      Pending withdrawals need to wait for block confirmations
                      before submitting a claim. You can only choose a
                      withdrawal request that is ready for claiming.
                    </p>
                  </div>
                  <div>
                    <NumericTransactionRow
                      label="Max transaction cost"
                      value={{
                        value: txnCost,
                        suffix: " DFI",
                        decimalScale: getDecimalPlace(txnCost),
                        prefix: "$",
                      }}
                    />
                  </div>

                  <div className="mt-4">
                    <CTAButton
                      testId="withdraw-mdfi-btn"
                      label="Claim DFI"
                      customStyle="w-full md:py-5"
                      onClick={handleOnClick}
                    />
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
