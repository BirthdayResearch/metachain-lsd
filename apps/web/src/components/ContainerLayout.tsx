"use client";

import type { Metadata } from "next";
import "../globals.css";
import Header from "@/components/Header";
import { Montserrat } from "next/font/google";
import { Next13ProgressBar } from "next13-progressbar";
import {
  NetworkProvider as WhaleNetworkProvider,
  WhaleProvider,
} from "@waveshq/walletkit-ui";
import SecuredStoreAPI from "../api/secure-storage";
import Logging from "@/api/logging";
import React, { useRef, useState, useEffect } from "react";
import Footer from "@/components/Footer";
import { Provider } from "react-redux";
import { store } from "@/store/store";

export const metadata: Metadata = {
  title: "MarbleFI",
  description: "LSD protocol",
};

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
        className={`${inter.className} absolute top-0 left-0 z-auto h-full w-full bg-cover bg-no-repeat bg-clip-border bg-[url('/background-mobile-375.svg')] md:bg-[url('/background-web-1440.svg')]`}
      >
        <Provider store={store}>
          {mounted && (
            <WhaleNetworkProvider api={SecuredStoreAPI} logger={Logging}>
              <WhaleProvider>
                <div
                  ref={contentRef}
                  className="flex min-h-screen flex-col items-center w-full px-5 py-8 md:p-12 text-light-1000"
                >
                  {children}
                  <Next13ProgressBar
                    height="4px"
                    color="#69FF23"
                    options={{ showSpinner: true }}
                    showOnShallow
                  />
                  <Footer parentReference={contentRef} />
                </div>
              </WhaleProvider>
            </WhaleNetworkProvider>
          )}
        </Provider>
      </body>
    </html>
  );
}
