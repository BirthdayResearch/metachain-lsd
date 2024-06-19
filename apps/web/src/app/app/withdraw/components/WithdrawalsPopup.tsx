import React from "react";
import { MdAccessTimeFilled } from "react-icons/md";
import clsx from "clsx";
import { Tag } from "@/components/Tag";
import { FaCircleCheck } from "react-icons/fa6";
import { FiExternalLink } from "react-icons/fi";
import { CTAButton } from "@/components/button/CTAButton";

export function WithdrawalsPopup() {
  return (
    <section>
      <div
        className={clsx(
          "absolute bg-white rounded-[30px] flex flex-col p-8 gap-y-4",
        )}
      >
        <span className="text-xl font-medium">Withdrawals</span>
        <div>
          <div className="flex items-center mb-2">
            <Tag
              text="PENDING"
              testId="pending-tag"
              customStyle="w-fit px-1 !py-1"
              customTextStyle="text-light-1000/50"
              Icon={<MdAccessTimeFilled className="text-warning" size={16} />}
            />
            <span className="block min-w-[319px] w-full border-dark-00/10 border-t-[0.5px]" />
          </div>
          <div className="ml-2">
            <div className="flex justify-between items-center py-1.5">
              <span className="text-sm font-semibold">12.12 DFI</span>
              <div className="flex gap-x-2 items-center">
                <span className="text-xs">1889saz12…89ms</span>
                <FiExternalLink size={16} />
              </div>
            </div>
            <div className="flex justify-between items-center py-1.5">
              <span className="text-sm font-semibold">2.92 DFI</span>
              <div className="flex gap-x-2 items-center">
                <span className="text-xs">1889saz12…89ms</span>
                <FiExternalLink size={16} />
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="flex items-center mb-2">
            <Tag
              text="READY"
              testId="ready-tag"
              customStyle="w-fit px-1 py-1"
              customTextStyle="text-light-1000/50"
              Icon={<FaCircleCheck className="text-green" size={14} />}
            />
            <span className="block min-w-[319px] w-full border-dark-00/10 border-t-[0.5px]" />
          </div>
          <div className="ml-2">
            <div className="flex justify-between items-center py-1">
              <span className="text-sm font-semibold">12.12 DFI</span>
              <CTAButton
                customBgColor="button-bg-gradient-1"
                customStyle="!px-3 !py-1"
                customTextStyle="text-xs font-medium"
                label="Claim"
                testId="claim-btn"
              />
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-sm font-semibold">11,121.13 DFI</span>
              <CTAButton
                customBgColor="button-bg-gradient-1"
                customStyle="!px-3 !py-1"
                customTextStyle="text-xs font-medium"
                label="Claim"
                testId="claim-btn"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
