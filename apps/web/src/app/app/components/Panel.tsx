import { ReactElement } from "react";
import clsx from "clsx";

export default function Panel({
  customStyle,
  children,
}: {
  customStyle?: string;
  children: ReactElement;
}) {
  return (
    <div
      className={clsx(
        "panel-ui rounded-[30px] flex flex-col px-5 mx-auto md:px-10 lg:px-[120px] py-12 lg:py-[96px] w-full md:max-w-4xl",
        customStyle,
      )}
    >
      {children}
    </div>
  );
}
