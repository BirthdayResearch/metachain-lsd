import clsx from "clsx";
import { ReactElement } from "react";

export default function SectionContainer({
  id,
  customContainerStyle,
  children,
}: {
  id?: string;
  customContainerStyle?: string;
  children: ReactElement;
}) {
  return (
    <div
      id={id}
      className={clsx(
        customContainerStyle,
        "w-full flex items-center justify-between"
      )}
    >
      {children}
    </div>
  );
}
