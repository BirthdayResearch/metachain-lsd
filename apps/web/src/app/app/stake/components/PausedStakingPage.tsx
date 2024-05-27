import Image from "next/image";
import Panel from "@/app/app/stake/components/Panel";

export default function PausedStakingPage() {
  return (
    <Panel>
      <div className="flex items-center gap-x-12">
        <Image
          src="/staking-paused-logo.png"
          alt="staking paused logo"
          width={154}
          height={176}
          className="w-[154px] h-[168px]"
        />
        <div className="flex flex-col gap-y-6">
          <div className="flex flex-col gap-y-2">
            <span className="text-[28px] leading-10 font-semibold">
              Staking paused
            </span>
            <span className="text-xl">
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
