import React, { useState } from "react";
import { MdAccessTimeFilled } from "react-icons/md";
import clsx from "clsx";
import { Tag } from "@/components/Tag";
import { FaCircleCheck } from "react-icons/fa6";
import { CTAButton } from "@/components/button/CTAButton";
import { WithdrawalStatusDataProps } from "@/hooks/useGetWithdrawalDetails";
import { formatEther } from "ethers";
import NumericFormat from "@/components/NumericFormat";
import { getDecimalPlace } from "@/lib/textHelper";
import { IoMdClose } from "react-icons/io";
import { formatTimestampToDate } from "@/lib/dateHelper";
import ClaimModal from "@/app/app/withdraw/components/ClaimModal";

export function WithdrawalsPopup({
  pendingWithdrawals,
  confirmedWithdrawals,
  onClose,
}: {
  pendingWithdrawals: WithdrawalStatusDataProps[];
  confirmedWithdrawals: WithdrawalStatusDataProps[];
  onClose: () => void;
}) {
  const [isActive, setIsActive] = useState(false);
  const [selectedReqId, setSelectedReqId] = useState<string>();
  const handleOnClick = (requestId: string) => {
    setIsActive(!isActive);
    setSelectedReqId(requestId);
  };
  return (
    <section>
      <div
        className={clsx(
          "bg-white rounded-[30px] flex flex-col p-8 gap-y-4 max-w-[468px]",
          "absolute bottom-[110%] md:-translate-x-16 lg:-translate-x-1/3",
        )}
      >
        <ClaimModal
          isActive={isActive}
          onClose={handleOnClick}
          selectedReqId={selectedReqId}
          pendingWithdrawals={pendingWithdrawals}
          confirmedWithdrawals={confirmedWithdrawals}
        />
        <div className="relative">
          <span className="text-xl font-medium">Withdrawals</span>
          <IoMdClose
            size={24}
            onClick={onClose}
            className="absolute right-0 top-0 text-light-1000 cursor-pointer"
          />
        </div>
        <div>
          <div className="flex items-center mb-2">
            <Tag
              text="PENDING"
              testId="pending-tag"
              customStyle="w-fit !pl-1 !pr-2 !py-1"
              customTextStyle="text-light-1000/50"
              Icon={<MdAccessTimeFilled className="text-warning" size={16} />}
            />
            <span className="block min-w-[319px] w-full border-dark-00/10 border-t-[0.5px]" />
          </div>
          <div className="ml-2">
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
                          decimalScale={getDecimalPlace(formattedAsset)}
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
        <div>
          <div className="flex items-center mb-2">
            <Tag
              text="READY"
              testId="ready-tag"
              customStyle="w-fit !pl-1 !pr-2 !py-1"
              customTextStyle="text-light-1000/50"
              Icon={<FaCircleCheck className="text-green" size={14} />}
            />
            <span className="block min-w-[319px] w-full border-dark-00/10 border-t-[0.5px]" />
          </div>
          <div className="ml-2">
            {confirmedWithdrawals.length > 0 ? (
              <>
                {confirmedWithdrawals.map(({ amountOfAssets, requestId }) => {
                  const formattedAsset = formatEther(amountOfAssets.toString());
                  return (
                    <div
                      key={`ready-withdrawal-${requestId}`}
                      className="flex justify-between items-center py-1"
                    >
                      <NumericFormat
                        className="text-sm font-semibold"
                        value={formattedAsset}
                        suffix=" DFI"
                        decimalScale={getDecimalPlace(formattedAsset)}
                      />
                      <CTAButton
                        customBgColor="button-bg-gradient-1"
                        customStyle="!px-3 !py-1"
                        customTextStyle="text-xs font-medium"
                        label="Claim"
                        testId="claim-btn"
                        onClick={() => handleOnClick(requestId.toString())}
                      />
                    </div>
                  );
                })}
              </>
            ) : (
              <span className="text-xs text-light-1000/70">
                No transactions available for claiming at the moment. Processing
                usually takes 7-10 days, depending on network congestion.
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
