import Panel from "@/app/app/stake/components/Panel";

import SpinnerIcon from "@/app/app/components/icons/SpinnerIcon";
import { SuccessCopy } from "@/app/app/components/SuccessCopy";

// Common component for Stake and Withdraw Confirming pages
export default function ConfirmingPage({
  title,
  description,
  showSuccessCopy,
  buttons,
  children,
}: {
  title: string;
  description: string;
  showSuccessCopy: boolean;
  buttons: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Panel customStyle="flex flex-col">
      <>
        <SuccessCopy
          containerClass="m-auto right-0 left-0 top-5"
          show={showSuccessCopy}
        />
        <article className="flex flex-col gap-y-6 md:gap-y-10">
          <SpinnerIcon />
          <section className="flex flex-col gap-y-6">
            <div className="flex flex-col gap-y-2">
              <h3 className="text-2xl leading-7 font-medium">{title}</h3>
              <p className="text-sm">{description}</p>
            </div>
            <section className="border rounded-[20px] p-5 md:p-8 divide-y flex justify-center flex-col">
              {children}
            </section>
          </section>
          <div className="flex flex-col md:flex-row gap-4">{buttons}</div>
        </article>
      </>
    </Panel>
  );
}
