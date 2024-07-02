import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment, useEffect, useRef } from "react";
import { IoMdClose } from "react-icons/io";
import { CTAButton } from "@/components/button/CTAButton";
import { getDecimalPlace } from "@/lib/textHelper";
import { NumericTransactionRow } from "@/app/app/components/NumericTransactionRow";
import Image from "next/image";
import { MdAccessTimeFilled } from "react-icons/md";
import { Tag } from "@/components/Tag";
import Checkbox from "@/components/Checkbox";
import { FaCircleCheck } from "react-icons/fa6";
import { WithdrawalStatusDataProps } from "@/hooks/useGetWithdrawalDetails";
import { formatEther } from "ethers";
import NumericFormat from "@/components/NumericFormat";

export default function ClaimModal({
  isActive,
  onClose,
  selectedReqId,
  pendingWithdrawals,
  confirmedWithdrawals,
}: {
  isActive: boolean;
  onClose: any;
  selectedReqId?: string;
  pendingWithdrawals: WithdrawalStatusDataProps[];
  confirmedWithdrawals: WithdrawalStatusDataProps[];
}) {
  return (
    <Transition appear show={isActive} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
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
              <Dialog.Panel className="absolute md:relative bottom-0 flex flex-col w-full md:max-w-[672px] min-h-[632px] md:min-h-[480px] lg:max-w-[768px] transform overflow-hidden rounded-2xl bg-white px-5 pt-10 pb-16 md:p-12 text-left align-middle shadow-xl transition-all">
                <Dialog.Title className="text-2xl font-semibold leading-7">
                  Claim DFI
                </Dialog.Title>
                <IoMdClose
                  size={24}
                  onClick={onClose}
                  className="absolute right-8 top-8 text-light-1000 cursor-pointer"
                />
                <div className="mt-2">
                  <p className="text-sm">
                    Pending withdrawals need to wait for block confirmations
                    before submitting a claim. You can only choose a withdrawal
                    request that is ready for claiming.
                  </p>
                </div>
                <div className="flex flex-col rounded-[10px] border border-light-1000/10 px-3 py-5 md:p-5 mt-8 md:mt-5 gap-y-5 max-h-48 overflow-auto">
                  {pendingWithdrawals && (
                    <>
                      {pendingWithdrawals.map(
                        ({ amountOfAssets, requestId, isFinalized }) => {
                          const formatAsset = formatEther(
                            amountOfAssets.toString(),
                          );
                          const isSelectedReqId = requestId === selectedReqId;
                          return (
                            <div
                              key={`pending-withdrawal-claim-modal-${requestId}`}
                            >
                              <ClaimRow
                                formatAsset={formatAsset}
                                isSelectedReqId={isSelectedReqId}
                                isFinalized={isFinalized}
                              />
                            </div>
                          );
                        },
                      )}
                    </>
                  )}

                  {confirmedWithdrawals && (
                    <>
                      {confirmedWithdrawals.map(
                        ({ amountOfAssets, requestId, isFinalized }) => {
                          const formatAsset = formatEther(
                            amountOfAssets.toString(),
                          );
                          const isSelectedReqId = requestId === selectedReqId;
                          return (
                            <div
                              key={`confirmed-withdrawal-claim-modal-${requestId}`}
                            >
                              <ClaimRow
                                formatAsset={formatAsset}
                                isSelectedReqId={isSelectedReqId}
                                isFinalized={isFinalized}
                              />
                            </div>
                          );
                        },
                      )}
                    </>
                  )}
                </div>
                <div className="mt-auto md:mt-0">
                  <div className="flex flex-col px-2 md:px-5 gap-y-4 md:gap-y-5 py-2 md:mt-3">
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

                  <div className="mt-4 md:mt-10">
                    <CTAButton
                      testId="withdraw-mdfi-btn"
                      label="Claim DFI"
                      customStyle="w-full md:py-5"
                      onClick={onClose}
                    />
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

function ClaimRow({
  formatAsset,
  isSelectedReqId,
  isFinalized,
}: {
  formatAsset: string;
  isSelectedReqId: boolean;
  isFinalized: boolean;
}) {
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    console.log("isSelectedReqId", isSelectedReqId);
  }, [isSelectedReqId]);
  return (
    <div className="flex justify-between">
      <div className="flex">
        <Checkbox
          ref={ref}
          isChecked={isSelectedReqId}
          onClick={() => console.log("clicked")}
        />
        <div className="">
          <NumericFormat
            className="ml-2 md:ml-4 mr-2 text-sm md:text-base text-light-1000/70 font-semibold"
            value={formatAsset}
            suffix=" DFI"
            decimalScale={getDecimalPlace(formatAsset)}
          />
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
      {isFinalized ? (
        <Tag
          text="READY"
          testId="ready-tag"
          customStyle="w-fit !pl-1 !pr-2 !py-1"
          customTextStyle="text-light-1000/50"
          Icon={<FaCircleCheck className="text-green" size={14} />}
        />
      ) : (
        <Tag
          text="PENDING"
          testId="pending-tag"
          customStyle="w-fit !pl-1 !pr-2 !py-1"
          customTextStyle="text-light-1000/50"
          Icon={<MdAccessTimeFilled className="text-warning" size={16} />}
        />
      )}
    </div>
  );
}
