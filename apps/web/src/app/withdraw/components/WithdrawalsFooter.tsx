export default function WithdrawalsFooter() {
  return (
    <section className="py-10 grid gap-y-8">
      <div className="flex flex-row items-center gap-x-6 w-full">
        <div>
          <span className="text-sm font-semibold">Withdrawal process</span>
          <p className="text-xs text-light-1000/50">
            Claims for withdrawals approximately take 7 processing days. Once
            your claim is processed,  you can submit your claim to receive your
            DFI. Make sure to regularly check your wallet for your withdrawal
            claims.
          </p>
        </div>
        <HighlightedButton />
      </div>
    </section>
  );
}

function HighlightedButton() {
  return (
    <button className="highlighted-button-ui pl-2 pr-3 py-2 flex flex-row items-center gap-x-2 min-w-fit">
      <span className="text-xs font-medium">View FAQs</span>
    </button>
  );
}
