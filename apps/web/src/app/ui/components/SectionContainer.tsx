import clsx from "clsx";
import { ReactElement } from "react";

export default function SectionContainer({
  customContainerStyle,
  children,
}: {
  customContainerStyle: string;
  children: ReactElement;
}) {
  return (
    <div
      className={clsx(
        customContainerStyle,
        "w-full flex items-center justify-between py-[120px] md:gap-y-16",
      )}
    >
      {children}
    </div>
  );
}
