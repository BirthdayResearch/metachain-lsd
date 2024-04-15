import { ReactElement } from "react";
import clsx from "clsx";

export default function DialogueBox({
  customStyle,
  children,
}: {
  customStyle?: string;
  children: ReactElement;
}) {
  return (
    <div
      className={clsx(
        "dialogue-box-ui w-full flex flex-col pt-16 px-32",
        customStyle,
      )}
    >
      {children}
    </div>
  );
}
