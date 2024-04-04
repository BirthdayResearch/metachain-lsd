import type { Metadata } from "next";
import "../globals.css";
import ContainerLayout from "@/components/ContainerLayout";
import { Montserrat } from "next/font/google";

const inter = Montserrat({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MarbleFI",
  description: "LSD protocol",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ContainerLayout>
      <div
        className={`${inter.className} max-w-5xl w-full flex flex-row items-center justify-between`}
      >
        {children}
      </div>
    </ContainerLayout>
  );
}
