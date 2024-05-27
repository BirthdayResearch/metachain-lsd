import Image from "next/image";
import Panel from "@/app/app/stake/components/Panel";

export default function PausedStakingPage() {
  return (
    <Panel>
      <div className="flex flex-col lg:flex-row items-center lg:gap-x-12">
        <Image
          src="/staking-paused-logo.svg"
          alt="staking paused logo"
          width={154}
          height={176}
          className="w-[126px] h-[144px] md:w-[154px] md:h-[176px] lg:h-[168px] mr-auto mb-7 lg:mb-0"
        />
        <div className="flex flex-col gap-y-6">
          <div className="flex flex-col gap-y-2">
            <span className="text-[28px] leading-10 font-semibold">
              Staking paused
            </span>
            <span className="text-xl md:text-lg md:leading-6 lg:text-xl">
              Staking has been paused temporarily for necessary precautions.
              Please check again after a few hours or visit our Twitter for any
              new updates.
            </span>
          </div>
          <span className="text-sm">
            For any immediate concerns, you can report concerns here.
          </span>
        </div>
      </div>
    </Panel>
  );
}
