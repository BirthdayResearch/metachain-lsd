import React, { Fragment, useState } from "react";
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
import ClaimModal from "@/app/app/withdraw/components/ClaimModal";

export function WithdrawalsPopupMobile({
  pendingWithdrawals,
  confirmedWithdrawals,
  onClose,
  isActive,
  submitClaim,
  isClaimPending,
}: {
  pendingWithdrawals: WithdrawalStatusDataProps[];
  confirmedWithdrawals: WithdrawalStatusDataProps[];
  onClose: () => void;
  isActive: boolean;
  submitClaim: (selectedReqIds: any, totalClaimAmt: string) => void;
  isClaimPending: boolean;
}) {
  const [isConfirmModalActive, setIsConfirmModalActive] = useState(false);
  const [selectedReqId, setSelectedReqId] = useState<string>();

  const handleOnClick = (requestId?: string) => {
    setIsConfirmModalActive(!isConfirmModalActive);
    if (!!requestId) {
      setSelectedReqId(requestId);
    }
  };
  return (
    <section>
      {isActive && (
        <ClaimModal
          isActive={isConfirmModalActive}
          onClose={handleOnClick}
          selectedReqId={selectedReqId}
          pendingWithdrawals={pendingWithdrawals}
          confirmedWithdrawals={confirmedWithdrawals}
          submitClaim={submitClaim}
          isClaimPending={isClaimPending}
        />
      )}
      <Transition appear show={isActive} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          open
          onClose={() => {
            /* Does not allow closing when click on backdrop */
          }}
        >
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
                <Dialog.Panel className="absolute bottom-0 flex flex-col w-full max-w-md transform overflow-hidden rounded-t-[30px] bg-white py-8 gap-y-4 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title className="text-xl font-medium px-8">
                    Withdrawals
                  </Dialog.Title>
                  <IoMdClose
                    size={24}
                    onClick={onClose}
                    className="absolute right-8 top-8 text-light-1000 cursor-pointer"
                  />

                  <div className="max-h-96 overflow-y-scroll">
                    <div className="px-8">
                      <div className="flex items-center mb-2">
                        <Tag
                          text="PENDING"
                          testId="pending-tag"
                          customStyle="w-fit pl-1 pr-2 py-1"
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
                      <div className="ml-2 flex flex-col space-y-1">
                        {pendingWithdrawals.length > 0 ? (
                          <>
                            {pendingWithdrawals.map(
                              ({ amountOfAssets, timestamp, requestId }) => {
                                const formattedAsset = formatEther(
                                  amountOfAssets.toString(),
                                );
                                return (
                                  <div
                                    key={`pending-withdrawal-${requestId}`}
                                    className="flex justify-between items-center py-1.5"
                                  >
                                    <NumericFormat
                                      className="text-sm font-semibold"
                                      value={formattedAsset}
                                      suffix=" DFI"
                                      decimalScale={getDecimalPlace(
                                        formattedAsset,
                                      )}
                                    />
                                    <div className="text-xs">
                                      {formatTimestampToDate(timestamp)}
                                    </div>
                                  </div>
                                );
                              },
                            )}
                          </>
                        ) : (
                          <span className="text-xs text-light-1000/70">
                            No pending transaction.
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="px-8">
                      <div className="flex items-center mb-2">
                        <Tag
                          text="READY"
                          testId="ready-tag"
                          customStyle="w-fit pl-1 pr-2 py-1"
                          customTextStyle="text-light-1000/50"
                          Icon={
                            <FaCircleCheck className="text-green" size={14} />
                          }
                        />
                        <span className="block min-w-[226px] w-full border-dark-00/10 border-t-[0.5px]" />
                      </div>
                      <div className="ml-2 flex flex-col space-y-1">
                        {confirmedWithdrawals.length > 0 ? (
                          <>
                            {confirmedWithdrawals.map(
                              ({ amountOfAssets, requestId }) => {
                                const formattedAsset = formatEther(
                                  amountOfAssets.toString(),
                                );
                                return (
                                  <div
                                    key={`ready-withdrawal-${requestId}`}
                                    className="flex justify-between items-center py-1"
                                  >
                                    <NumericFormat
                                      className="text-sm font-semibold"
                                      value={formattedAsset}
                                      suffix=" DFI"
                                      decimalScale={getDecimalPlace(
                                        formattedAsset,
                                      )}
                                    />
                                    <CTAButton
                                      customBgColor="button-bg-gradient-1"
                                      customPadding="px-3 py-1"
                                      customTextStyle="text-xs font-medium"
                                      label="Claim"
                                      testId="claim-btn"
                                      onClick={() =>
                                        handleOnClick(requestId.toString())
                                      }
                                    />
                                  </div>
                                );
                              },
                            )}
                          </>
                        ) : (
                          <span className="text-xs text-light-1000/70">
                            No transactions available for claiming at the
                            moment. Processing usually takes 7-10 days,
                            depending on network congestion.
                          </span>
                        )}
                      </div>
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
