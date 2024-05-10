import Panel from "@/app/app/stake/components/Panel";
import { CTAButton } from "@/components/button/CTAButton";
import { CTAButtonOutline } from "@/components/button/CTAButtonOutline";
import SpinnerIcon from "@/app/app/components/icons/SpinnerIcon";

export default function ConfirmingPage({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Panel customStyle="flex flex-col">
      <article className="flex flex-col gap-y-6 md:gap-y-10">
        <SpinnerIcon />
        <section className="flex flex-col gap-y-6">
          <div className="flex flex-col gap-y-2">
            <h3 className="text-2xl	leading-7 font-medium">
              Confirming your stake…
            </h3>
            <p className="text-sm">
              Waiting confirmation from the blockchain. It is safe to close this
              window – your transaction will reflect automatically in your
              wallet once completed.
            </p>
          </div>
          <section className="border rounded-[20px] p-5 md:p-8 divide-y flex justify-center flex-col">
            {children}
          </section>
        </section>
        <div className="flex flex-col md:flex-row gap-4">
          <CTAButton
            label="Return to main page"
            testID="stake-confirming-return-main"
            customStyle={"w-full"}
          />
          <CTAButtonOutline
            label="Add mDFI to wallet"
            testID="stake-confirming-add-mdfi"
            customStyle={"w-full"}
          />
        </div>
      </article>
    </Panel>
  );
}
