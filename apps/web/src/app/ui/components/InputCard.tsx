enum AmountButton {
  TwentyFive = "25%",
  Half = "50%",
  SeventyFive = "75%",
  Max = "Max",
}

export function PercentageButton({ percentage }: { percentage: string }) {
  return (
    <button className="">
      <span className="">{percentage}</span>
    </button>
  );
}

export function InputCard({
  amt,
  setAmt,
}: {
  amt: string;
  setAmt: (amt: string) => void;
}) {
  return (
    <div className="flex flex-row justify-between gap-x-6 bg-blue-400 p-6 rounded-[10px] items-center">
      <div className="flex justify-center items-center text-center">
        DFI icon
      </div>
      <div className="flex flex-col w-full">
        <input
          value={amt}
          type="text"
          className="w-full  rounded"
          placeholder="0.00"
          onChange={(e) => {
            setAmt(e.target.value);
          }}
        />
        value
      </div>
      <div className="gap-x-1 flex">
        {Object.values(AmountButton).map((type) => (
          <PercentageButton key={type} percentage={type} />
        ))}
      </div>
    </div>
  );
}
