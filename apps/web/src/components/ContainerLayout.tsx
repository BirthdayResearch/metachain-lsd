"use client";

import "../globals.css";
import { Montserrat } from "next/font/google";
import { Next13ProgressBar } from "next13-progressbar";
import React, { useRef, useState, useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import { NetworkProvider } from "@/context/NetworkContext";
import { WhaleProvider } from "@/context/WhaleProvider";
import { StatsProvider } from "@/context/StatsProvider";

const inter = Montserrat({ subsets: ["latin"] });

export default function ContainerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const contentRef = useRef<HTMLDivElement>(null);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <html lang="en">
      <body
        suppressHydrationWarning={true}
        className={`${inter.className} absolute top-0 left-0 z-auto h-full w-full bg-cover bg-no-repeat bg-clip-border bg-[url('/background-mobile-375.svg')] md:bg-[url('/background-web-1440.svg')]`}
      >
        <NetworkProvider>
          <WhaleProvider>
            <Provider store={store}>
              <StatsProvider>
                {mounted && (
                  <div
                    ref={contentRef}
                    className="flex min-h-screen flex-col items-center w-full text-light-1000"
                  >
                    {children}
                    <Next13ProgressBar
                      height="4px"
                      color="#69FF23"
                      options={{ showSpinner: true }}
                      showOnShallow
                    />
                  </div>
                )}
              </StatsProvider>
            </Provider>
          </WhaleProvider>
        </NetworkProvider>
      </body>
    </html>
  );
}
