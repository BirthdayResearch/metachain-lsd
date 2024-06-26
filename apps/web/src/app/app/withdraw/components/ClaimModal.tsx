import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment, useState, useRef } from "react";
import { IoMdClose } from "react-icons/io";
import { CTAButton } from "@/components/button/CTAButton";
import { getDecimalPlace } from "@/lib/textHelper";
import { NumericTransactionRow } from "@/app/app/components/NumericTransactionRow";
import Image from "next/image";
import { MdAccessTimeFilled } from "react-icons/md";
import { Tag } from "@/components/Tag";
import Checkbox from "@/components/Checkbox";

export default function ClaimModal({
  withdrawAmount,
}: {
  withdrawAmount: string;
}) {
  const [isOpen, setIsOpen] = useState(true);
  const ref = useRef<HTMLButtonElement>(null);

  function handleOnClick() {
    setIsOpen(!isOpen);
  }

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
                <Dialog.Panel className="w-full max-w-[768px] transform overflow-hidden rounded-2xl bg-white p-12 text-left align-middle shadow-xl transition-all">
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
                  <div className="rounded-[10px] border border-light-1000/10 p-5 mt-5">
                    <div className="flex justify-between">
                      <div className="flex">
                        <Checkbox
                          ref={ref}
                          isChecked={!isOpen}
                          onClick={() => console.log("clicked")}
                        />
                        <div className="ml-4 mr-2 text-light-1000/70 font-semibold">
                          2 DFI
                        </div>
                        <Image
                          data-testid="dfi-icon"
                          src="/icons/dfi-icon.svg"
                          alt="DFI icon"
                          className="min-w-4"
                          priority
                          width={16}
                          height={16}
                        />
                      </div>
                      <Tag
                        text="PENDING"
                        testId="pending-tag"
                        customStyle="w-fit !pl-1 !pr-2 !py-1"
                        customTextStyle="text-light-1000/50"
                        Icon={
                          <MdAccessTimeFilled
                            className="text-warning"
                            size={16}
                          />
                        }
                      />
                    </div>
                  </div>
                  <div className="flex flex-col px-5 gap-y-5 py-2 mt-3">
                    <NumericTransactionRow
                      label="Max transaction cost"
                      value={{
                        value: "0.0",
                        suffix: " DFI",
                        decimalScale: getDecimalPlace("0.0"),
                      }}
                      customStyle="!py-0"
                    />
                    <NumericTransactionRow
                      label="Total to claim"
                      value={{
                        value: "14",
                        suffix: " DFI",
                        decimalScale: getDecimalPlace("0.0"),
                      }}
                      customStyle="!py-0"
                    />
                  </div>

                  <div className="mt-10">
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
