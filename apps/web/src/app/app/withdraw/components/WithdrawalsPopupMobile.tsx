import React, { Fragment } from "react";
import { MdAccessTimeFilled } from "react-icons/md";
import { Tag } from "@/components/Tag";
import { FaCircleCheck } from "react-icons/fa6";
import { CTAButton } from "@/components/button/CTAButton";
import { WithdrawalStatusDataProps } from "@/hooks/useGetWithdrawalDetails";
import { formatEther } from "ethers";
import NumericFormat from "@/components/NumericFormat";
import { getDecimalPlace } from "@/lib/textHelper";
import { IoMdClose } from "react-icons/io";
import { formatTimestampToDate } from "@/lib/dateHelper";
import { Dialog, Transition } from "@headlessui/react";

export function WithdrawalsPopupMobile({
  pendingWithdrawalsArray,
  confirmedWithdrawalsArray,
  onClose,
  isActive,
}: {
  pendingWithdrawalsArray: WithdrawalStatusDataProps[];
  confirmedWithdrawalsArray: WithdrawalStatusDataProps[];
  onClose: any;
  isActive: boolean;
}) {
  return (
    <section>
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
            <div className="fixed inset-0 bg-black/70" />
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
                <Dialog.Panel className="absolute bottom-0 flex flex-col w-full max-w-md transform overflow-hidden rounded-t-[30px] bg-white p-8 gap-y-4 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title className="text-xl font-medium">
                    Withdrawals
                  </Dialog.Title>
                  <IoMdClose
                    size={24}
                    onClick={onClose}
                    className="absolute right-8 top-8 text-light-1000 cursor-pointer"
                  />

                  <div>
                    <div className="flex items-center mb-2">
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
                      <span className="block min-w-[226px] w-full border-dark-00/10 border-t-[0.5px]" />
                    </div>
                    <div className="ml-2">
                      {pendingWithdrawalsArray.length > 0 ? (
                        <>
                          {pendingWithdrawalsArray.map((withdrawal) => (
                            <div
                              key={`pending-withdrawal-${formatEther(withdrawal.amountOfAssets.toString())}`}
                              className="flex justify-between items-center py-1.5"
                            >
                              <NumericFormat
                                className="text-sm font-semibold"
                                value={formatEther(
                                  withdrawal.amountOfAssets.toString(),
                                )}
                                suffix=" DFI"
                                decimalScale={getDecimalPlace(
                                  formatEther(
                                    withdrawal.amountOfAssets.toString(),
                                  ),
                                )}
                              />
                              <div className="text-xs">
                                {formatTimestampToDate(withdrawal.timestamp)}
                              </div>
                            </div>
                          ))}
                        </>
                      ) : (
                        <span className="text-xs text-light-1000/70">
                          No pending transaction.
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center mb-2">
                      <Tag
                        text="READY"
                        testId="ready-tag"
                        customStyle="w-fit !pl-1 !pr-2 !py-1"
                        customTextStyle="text-light-1000/50"
                        Icon={
                          <FaCircleCheck className="text-green" size={14} />
                        }
                      />
                      <span className="block min-w-[226px] w-full border-dark-00/10 border-t-[0.5px]" />
                    </div>
                    <div className="ml-2">
                      {confirmedWithdrawalsArray.length > 0 ? (
                        <>
                          {confirmedWithdrawalsArray.map((withdrawal) => (
                            <div
                              key={`ready-withdrawal-${formatEther(withdrawal.amountOfAssets.toString())}`}
                              className="flex justify-between items-center py-1"
                            >
                              <NumericFormat
                                className="text-sm font-semibold"
                                value={formatEther(
                                  withdrawal.amountOfAssets.toString(),
                                )}
                                suffix=" DFI"
                                decimalScale={getDecimalPlace(
                                  formatEther(
                                    withdrawal.amountOfAssets.toString(),
                                  ),
                                )}
                              />
                              <CTAButton
                                customBgColor="button-bg-gradient-1"
                                customStyle="!px-3 !py-1"
                                customTextStyle="text-xs font-medium"
                                label="Claim"
                                testId="claim-btn"
                              />
                            </div>
                          ))}
                        </>
                      ) : (
                        <span className="text-xs text-light-1000/70">
                          No transactions available for claiming at the moment.
                          Processing usually takes 7-10 days, depending on
                          network congestion.
                        </span>
                      )}
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </section>
  );
}
