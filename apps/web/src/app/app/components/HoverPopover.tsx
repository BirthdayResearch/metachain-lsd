import React, { ReactNode, useState } from "react";
import { Placement, useFloating, shift } from "@floating-ui/react-dom";
import clsx from "clsx";

export function HoverPopover({
  popover,
  placement,
  className,
  children,
}: {
  popover: string | ReactNode;
  placement?: Placement;
  className?: string;
  children?: React.ReactNode;
}): JSX.Element {
  const [isHover, setIsHover] = useState(false);

  const { x, y, reference, floating, strategy } = useFloating({
    placement: placement ?? "bottom",
    middleware: [shift()],
    strategy: "fixed",
  });

  return (
    <>
      <div
        ref={reference}
        onMouseOver={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
        onTouchCancel={() => setIsHover(false)}
        className={clsx(className)}
      >
        {children}
      </div>
      {isHover ? (
        <div
          ref={floating}
          style={{
            position: strategy,
            top: y ?? "",
            left: x ?? "",
          }}
          className="p-2 z-20"
        >
          {typeof popover === "string" ? (
            <div className="rounded-[10px] bg-dark-00 px-4 py-3 text-dark-1000 text-xs text-left shadow-md max-w-xs">
              {popover}
            </div>
          ) : (
            popover
          )}
        </div>
      ) : null}
    </>
  );
}
