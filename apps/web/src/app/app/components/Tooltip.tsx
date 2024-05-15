import clsx from "clsx";
import React, { PropsWithChildren, useState } from "react";

interface Props {
  content: string;
  containerClass?: string;
  disableTooltip?: boolean;
  defaultStyle?: string;
  customStyle?: string;
}

export default function Tooltip({
  content,
  children,
  containerClass,
  defaultStyle = "bottom-[100%]",
  customStyle,
  disableTooltip = false,
}: PropsWithChildren<Props>): JSX.Element {
  let timeout: NodeJS.Timeout;
  const [active, setActive] = useState<boolean>(false);
  const timeoutTime = 300;

  const showTooltip = () => {
    timeout = setTimeout(() => {
      setActive(true);
    }, 300);
  };

  const hideTooltip = () => {
    timeout = setTimeout(() => {
      setActive(false);
      clearInterval(timeout);
    }, timeoutTime);
  };

  return (
    <div
      role="button"
      aria-label="tooltip-button"
      className={clsx(
        "inline-block rounded focus-visible:outline-none",
        containerClass,
      )}
      onMouseEnter={showTooltip}
      onClick={() => {
        if (active) {
          hideTooltip();
        } else {
          showTooltip();
          timeout = setTimeout(() => {
            hideTooltip();
          }, timeoutTime);
        }
      }}
      onMouseLeave={hideTooltip}
      onMouseDown={hideTooltip}
      onKeyDown={() => {}}
      tabIndex={0}
    >
      {children}
      {!disableTooltip && active && (
        <div
          className={clsx(
            `absolute  z-[30] -translate-x-[40%] md:-translate-x-1/2 rounded-[10px] bg-dark-00 px-4 py-3 text-dark-1000 text-xs whitespace-nowrap`,
            customStyle ?? defaultStyle,
          )}
        >
          {content}
        </div>
      )}
    </div>
  );
}
