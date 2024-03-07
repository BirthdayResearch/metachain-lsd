import clsx from "clsx";
import Image from "next/image";

const StatsDetails = [
  {
    label: "APR",
    value: "3.5%",
    testID: "apr",
  },
  {
    label: "Total value staked",
    value: "23.1K DFI",
    testID: "total-value-staked",
  },
  {
    label: "mDFI Market Cap",
    value: "3.1K mDFI",
    testID: "mdfi-market-cap",
  },
  {
    label: "Unique stakers",
    value: "7,741",
    testID: "unique-stakers",
  },
];

export default function Statistics() {
  return (
    <section className="py-10 grid gap-y-8">
      <div className="grid grid-cols-4 flex-row items-center justify-evenly">
        {StatsDetails.map((item, index) => (
          <article
            key={item.testID}
            data-testid={item.testID}
            className={clsx(
              "flex flex-col justify-between items-center border-l-[0.5px] gap-y-2",
              index === StatsDetails.length - 1 ? "border-r-[0.5px]" : "",
            )}
          >
            <span className="text-xs font-light">{item.label}</span>
            <span className="font-semibold text-xl">{item.value}</span>
          </article>
        ))}
      </div>
      <div className="flex flex-row items-center gap-x-6">
        <p className="text-xs font-light">
          mDFI is a reward-bearing token. It earns rewards not by amount but by
          value in relation to the staked DFI.
        </p>
        <HighlightedButton />
      </div>
    </section>
  );
}

function HighlightedButton() {
  return (
    <button className="highlighted-button-ui pl-2 pr-3 py-2 ml-2 mr-3 flex flex-row items-center min-w-[133px] gap-x-2">
      <Image
        data-testid="mdfi-logo"
        src="/mDFI.svg"
        alt="mDFI Logo"
        width={23.7}
        height={23.7}
      />
      <span className="text-xs font-semibold w-fit">View mDFI stats</span>
    </button>
  );
}
