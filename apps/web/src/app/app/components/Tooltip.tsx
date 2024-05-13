import clsx from "clsx";
import React, { PropsWithChildren, useState } from "react";

interface Props {
  content: string;
  title?: string;
  containerClass?: string;
  disableTooltip?: boolean;
  defaultStyle?: string;
  customStyle?: string;
}

export default function Tooltip({
  content,
  title,
  children,
  containerClass,
  defaultStyle = "w-fit bottom-[150%]",
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
            `absolute  z-[30] -translate-x-1/2 rounded bg-dark-1000 px-3 py-2 text-dark-00 text-caption-2-400
      before:absolute before:-z-[1] before:bottom-0 before:left-[27%] before:md:left-[35%] before:h-0 before:w-0 before:rotate-45 before:rounded-[1px]
          before:border-[10.5px] before:border-transparent before:border-t-dark-1000 before:bg-dark-1000`,
            customStyle ?? defaultStyle,
          )}
        >
          {title && <p className="text-caption-1-600 mb-1">{title}</p>}
          {content}
        </div>
      )}
    </div>
  );
}
