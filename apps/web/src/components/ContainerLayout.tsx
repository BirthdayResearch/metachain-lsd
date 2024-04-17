"use client";

import type { Metadata } from "next";
import "../globals.css";

import { Montserrat } from "next/font/google";
import { Next13ProgressBar } from "next13-progressbar";
import React from "react";
import { store } from "@/store/store";
import { Provider } from "react-redux";

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
  return (
    <html lang="en">
      <body
        className={`${inter.className} absolute top-0 left-0 z-auto h-full w-full bg-cover bg-no-repeat bg-clip-border bg-[url('/background-mobile-375.svg')] md:bg-[url('/background-web-1440.svg')]`}
      >
        <Provider store={store}>
          <div>{children}</div>
          <Next13ProgressBar
            height="4px"
            color="#69FF23"
            options={{ showSpinner: true }}
            showOnShallow
          />
        </Provider>
      </body>
    </html>
  );
}
