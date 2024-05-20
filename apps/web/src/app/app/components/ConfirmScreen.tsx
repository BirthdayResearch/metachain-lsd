import Panel from "@/app/app/stake/components/Panel";
import SpinnerIcon from "@/app/app/components/icons/SpinnerIcon";
import { SuccessCopy } from "@/app/app/components/SuccessCopy";
import DetailsRow from "@/app/app/components/DetailsRow";
import useCopyToClipboard from "@/hooks/useCopyToClipboard";
import { useEffect, useState } from "react";
import TxCompletedIcon from "@/app/app/components/icons/TxCompletedIcon";
import { NumericFormatProps } from "@/components/NumericFormat";
import { NumericTransactionRow } from "@/app/app/components/NumericTransactionRow";

// Common component for Stake and Withdraw Confirming and Confirmed pages
export default function ConfirmScreen({
  title,
  description,
  buttons,
  dfiAmounts,
  details,
  isLoading,
  hasCompleted,
}: {
  title: string;
  description: string;
  buttons: React.ReactNode;
  dfiAmounts: { label: string; value: NumericFormatProps }[];
  details: {
    label: string;
    value: string;
    linkType: string;
    displayActions?: boolean;
  }[];
  isLoading?: boolean;
  hasCompleted?: boolean;
}) {
  const { copy } = useCopyToClipboard();
  const [showSuccessCopy, setShowSuccessCopy] = useState(false);

  const handleOnCopy = (text: string | undefined) => {
    if (text) {
      copy(text);
      setShowSuccessCopy(true);
    }
  };

  useEffect(() => {
    if (showSuccessCopy) {
      setTimeout(() => setShowSuccessCopy(false), 2000);
    }
  }, [showSuccessCopy]);
  return (
    <Panel customStyle="flex flex-col">
      <>
        <SuccessCopy
          containerClass="m-auto right-0 left-0 top-5"
          show={showSuccessCopy}
        />
        <article className="flex flex-col gap-y-6 md:gap-y-10">
          {isLoading && <SpinnerIcon />}
          {hasCompleted && <TxCompletedIcon />}
          <section className="flex flex-col gap-y-6">
            <div className="flex flex-col gap-y-2">
              <h3 className="text-2xl leading-7 font-medium">{title}</h3>
              <p className="text-sm">{description}</p>
            </div>
            <section className="border-[0.5px] border-light-1000/10 bg-red-300 rounded-[20px] p-5 md:p-8 divide-y flex justify-center flex-col">
              {/* DFI and mDFI components */}
              {dfiAmounts.map((item) => (
                <NumericTransactionRow
                  key={item.label}
                  label={item.label}
                  value={item.value}
                  customStyle="py-[18px]"
                />
              ))}

              {/* Receiving Address and ID components */}
              {details.map((detail, index) => (
                <DetailsRow
                  key={index}
                  label={detail.label}
                  value={detail.value}
                  linkType={detail.linkType}
                  displayActions={detail.displayActions}
                  handleOnCopy={handleOnCopy}
                />
              ))}
            </section>
          </section>
          <div className="flex flex-col md:flex-row gap-4">{buttons}</div>
        </article>
      </>
    </Panel>
  );
}
