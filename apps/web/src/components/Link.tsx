import { useNetworkEnvironmentContext } from "@/context/NetworkEnvironmentContext";
import { LinkProps as NextLinkProps } from "next/dist/client/link";
import NextLink from "next/link";
import { forwardRef, PropsWithChildren } from "react";

interface AdditionalLinkProps {
  className?: string;
}

type LinkProps<T = any> = AdditionalLinkProps &
  NextLinkProps & {
    [key: string]: T;
  };

/**
 * Overrides the default next/link to provide ability to 'keep ?network= query string'.
 * This allows `<Link>` usage to be network agnostic where ?network= are automatically appended.
 *
 * LinkProps accepts href as a string or as a `UrlObject` object, gives us more flexibility.
 *
 * @param {PropsWithChildren<LinkProps>} props
 */

// eslint-disable-next-line react/display-name
const Link = forwardRef<HTMLAnchorElement, PropsWithChildren<LinkProps>>(
  ({ href, children, ...props }, ref) => {
    const { networkEnv, defaultNetwork } = useNetworkEnvironmentContext();

    const networkQuery =
      defaultNetwork !== networkEnv ? { network: networkEnv } : {};

    // Handles string or object href
    const pathname = typeof href === "object" ? href.pathname : href;
    const query =
      typeof href === "object" && typeof href.query === "object"
        ? href.query
        : {};

    return (
      <NextLink
        passHref
        {...props}
        ref={ref}
        href={{
          pathname,
          query: {
            ...query,
            ...networkQuery,
          },
        }}
      >
        {children}
      </NextLink>
    );
  },
);

export default Link;
