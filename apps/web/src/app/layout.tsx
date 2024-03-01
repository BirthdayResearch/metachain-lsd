import type { Metadata } from "next";
import "./globals.css";
import ContainerLayout from "@/app/ui/components/ContainerLayout";
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
      <main className={`${inter.className} md:max-w-5xl`}>{children}</main>
    </ContainerLayout>
  );
}
