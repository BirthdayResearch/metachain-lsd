import { Montserrat } from "next/font/google";

const inter = Montserrat({ subsets: ["latin"] });

export default function Tag() {
  return (
    <div
      className={`{${inter.className} border rounded-5 bg-light-00 w-fit py-1 px-4 rounded-[20px]`}
    >
      <span className="text-[10px] text-light-1000 font-bold leading-3 tracking-[.5px] uppercase">
        Beta release
      </span>
    </div>
  );
}
