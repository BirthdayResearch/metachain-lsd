import Image from "next/image";
import Panel from "@/app/app/components/Panel";

export default function PausedWithdrawalsPage() {
  return (
    <Panel>
      <div className="flex flex-col lg:flex-row items-center lg:gap-x-12">
        <Image
          src="/paused-logo.svg"
          alt="withdrawals paused logo"
          width={154}
          height={176}
          className="w-[126px] h-[144px] md:w-[154px] md:h-[176px] lg:h-[168px] mr-auto mb-7 lg:mb-0"
        />
        <div className="flex flex-col gap-y-6">
          <div className="flex flex-col gap-y-2">
            <span className="text-[28px] leading-10 font-semibold">
              Withdrawals paused
            </span>
            <span className="text-xl md:text-lg md:leading-6 lg:text-xl">
              Withdrawals are paused temporarily for necessary precautions.
              Please check again after a few hours or visit our Twitter for any
              new updates.
            </span>
          </div>
          <span className="text-sm">
            For any immediate concerns, you can report concerns
            <span className="font-semibold">
              <a href="mailto:frederick.chng@birthday.dev"> here.</a>
            </span>
          </span>
        </div>
      </div>
    </Panel>
  );
}
