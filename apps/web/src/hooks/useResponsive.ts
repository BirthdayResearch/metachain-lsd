import { useMediaQuery } from "react-responsive";
import config from "../../tailwind.config";

const useResponsive = () => {
  const { screens } = config.theme as { screens: Record<string, string> };

  const maxWidth = `calc(${parseInt(screens.md, 10) - 1}px)`;
  const isMobile = useMediaQuery({ maxWidth });

  const isXs = useMediaQuery({ minWidth: screens.xs });

  const isSm = useMediaQuery({ minWidth: screens.sm });

  const isMd = useMediaQuery({ minWidth: screens.md });

  const isLg = useMediaQuery({ minWidth: screens.lg });

  const isXl = useMediaQuery({ minWidth: screens.xl });

  const is2xl = useMediaQuery({ minWidth: screens["2xl"] });

  const is3xl = useMediaQuery({ minWidth: screens["3xl"] });

  type Key = `is${Capitalize<keyof typeof screens>}`;
  return {
    isMobile,
    isXs,
    isSm,
    isMd,
    isLg,
    isXl,
    is2xl,
    is3xl,
  } as Record<Key | "isMobile", boolean>;
};

export default useResponsive;
