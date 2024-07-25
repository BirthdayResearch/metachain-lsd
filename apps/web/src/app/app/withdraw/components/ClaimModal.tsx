import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { CTAButton } from "@/components/button/CTAButton";
import { getDecimalPlace } from "@/lib/textHelper";
import { NumericTransactionRow } from "@/app/app/components/NumericTransactionRow";
import Image from "next/image";
import { MdAccessTimeFilled, MdCancel } from "react-icons/md";
import { Tag } from "@/components/Tag";
import Checkbox from "@/components/Checkbox";
import { FaCircleCheck } from "react-icons/fa6";
import { WithdrawalStatusDataProps } from "@/hooks/useGetWithdrawalDetails";
import { formatEther, Interface, InterfaceAbi, parseEther } from "ethers";
import NumericFormat from "@/components/NumericFormat";
import BigNumber from "bignumber.js";
import { useContractContext } from "@/context/ContractContext";
import { useGetTxnCost } from "@/hooks/useGetTxnCost";
import useProceedToClaim from "@/hooks/useProceedToClaim";
import toast from "react-hot-toast";
import { CgSpinner } from "react-icons/cg";

export default function ClaimModal({
  isActive,
  onClose,
  closeParent,
  selectedReqId,
  pendingWithdrawals,
  confirmedWithdrawals,
}: {
  isActive: boolean;
  onClose: (requestId?: string) => void;
  closeParent: () => void;
  selectedReqId?: string;
  pendingWithdrawals: WithdrawalStatusDataProps[];
  confirmedWithdrawals: WithdrawalStatusDataProps[];
}) {
  const { MarbleLsdProxy } = useContractContext();
  const [totalClaimAmt, setTotalClaimAmt] = useState<BigNumber>(
    new BigNumber(0),
  );
  const [selectedReqIds, setSelectedReqIds] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onSuccess = () => {
    toast(
      "Redemption completed, please wait a moment for your redeemed amount to be reflected in your wallet.",
      {
        icon: <CgSpinner size={24} className="animate-spin text-green" />,
        duration: 1000,
        className:
          "px-2 py-1 !text-xs !text-dark-00 !bg-green mt-10 !rounded-md",
        id: "claimed",
      },
    );
    onClose();
    closeParent();
    setSelectedReqIds([]);
  };

  const { writeClaimWithdrawal, isClaimRequestPending } = useProceedToClaim({
    setErrorMessage,
    onSuccess,
  });

  function calculateTotal(
    input: BigNumber,
    checked: boolean,
    requestId: string,
  ) {
    if (checked) {
      setTotalClaimAmt((prevTotalSum) => prevTotalSum.plus(input));
    } else {
      setTotalClaimAmt((prevTotalSum) => prevTotalSum.minus(input));
    }

    setSelectedReqIds(
      checked
        ? [...selectedReqIds, requestId.toString()]
        : selectedReqIds.filter(
            (_requestId) => _requestId !== requestId.toString(),
          ),
    );
  }

  const data = new Interface(
    MarbleLsdProxy.abi as InterfaceAbi,
  ).encodeFunctionData("claimWithdrawals", [selectedReqIds]) as `0x${string}`;

  const { txnCost } = useGetTxnCost(data, parseEther("0"));

  const handleInitiateClaim = async () => {
    if (selectedReqIds?.length) {
      writeClaimWithdrawal(selectedReqIds);
    }
  };

  useEffect(() => {
    if (selectedReqId) {
      setSelectedReqIds([...selectedReqIds, selectedReqId]);
    }
  }, [selectedReqId]);

  useEffect(() => {
    if (errorMessage != null) {
      toast(errorMessage, {
        icon: <MdCancel size={24} className="text-red" />,
        duration: 5000,
        className:
          "!bg-light-900 px-2 py-1 text-xs !text-light-00 mt-10 rounded-md",
        id: "errorMessage",
      });
    }

    // cleanup
    return () => toast.remove("errorMessage");
  }, [errorMessage]);

  return (
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
                  onClick={() => {
                    onClose();
                    setSelectedReqIds([]);
                  }}
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
                          return (
                            <div
                              key={`pending-withdrawal-claim-modal-${requestId}`}
                            >
                              <ClaimRow
                                formatAsset={formatAsset}
                                requestId={requestId}
                                setTotalClaimAmt={setTotalClaimAmt}
                                isSelectedReqId={
                                  requestId.toString() === selectedReqId
                                }
                                isFinalized={isFinalized}
                                calculateTotal={calculateTotal}
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
                          return (
                            <div
                              key={`confirmed-withdrawal-claim-modal-${requestId}`}
                            >
                              <ClaimRow
                                formatAsset={formatAsset}
                                requestId={requestId}
                                setTotalClaimAmt={setTotalClaimAmt}
                                isSelectedReqId={
                                  requestId.toString() === selectedReqId
                                }
                                isFinalized={isFinalized}
                                calculateTotal={calculateTotal}
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
                        value: totalClaimAmt.eq(0) ? "0" : txnCost,
                        prefix: "$",
                        decimalScale: getDecimalPlace(txnCost),
                      }}
                      customStyle="py-0"
                    />
                    <NumericTransactionRow
                      label="Total to claim"
                      value={{
                        value: totalClaimAmt.toString(),
                        suffix: " DFI",
                        decimalScale: getDecimalPlace(totalClaimAmt),
                      }}
                      customStyle="py-0"
                    />
                  </div>

                  <div className="mt-4 md:mt-10">
                    <CTAButton
                      isDisabled={
                        isClaimRequestPending || selectedReqIds?.length === 0
                      }
                      isLoading={isClaimRequestPending}
                      testId="withdraw-mdfi-btn"
                      label="Claim DFI"
                      customStyle="w-full md:py-5"
                      onClick={handleInitiateClaim}
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
  requestId,
  isSelectedReqId,
  isFinalized,
  setTotalClaimAmt,
  calculateTotal,
}: {
  formatAsset: string;
  requestId: string;
  isSelectedReqId: boolean;
  isFinalized: boolean;
  setTotalClaimAmt: (totalClaimAmt: BigNumber) => void;
  calculateTotal: (
    input: BigNumber,
    checked: boolean,
    requestId: string,
  ) => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const [isSelected, setIsSelected] = useState(isSelectedReqId);

  useEffect(() => {
    if (isSelectedReqId) {
      setTotalClaimAmt(new BigNumber(formatAsset));
    }
  }, []);

  return (
    <div className="flex justify-between">
      <div className="flex">
        <Checkbox
          ref={ref}
          isChecked={isSelected}
          isDisabled={!isFinalized}
          onClick={() => {
            setIsSelected(!isSelected);
            calculateTotal(new BigNumber(formatAsset), !isSelected, requestId);
          }}
        />
        <div>
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
          customStyle="w-fit pl-1 pr-2 py-1"
          customTextStyle="text-light-1000/50"
          Icon={<FaCircleCheck className="text-green" size={14} />}
        />
      ) : (
        <Tag
          text="PENDING"
          testId="pending-tag"
          customStyle="w-fit pl-1 pr-2 py-1"
          customTextStyle="text-light-1000/50"
          Icon={<MdAccessTimeFilled className="text-warning" size={16} />}
        />
      )}
    </div>
  );
}
