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
        "w-full flex items-center justify-between max-w-xs md:max-w-4xl",
      )}
    >
      {children}
    </div>
  );
}
