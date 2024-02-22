import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ContainerLayout from "@/app/ui/components/ContainerLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MarbleFI",
  description: "LSD protocol",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ContainerLayout>
          <div
            className={`${inter.className} max-w-5xl w-full flex flex-row items-center justify-between`}
          >
            {children}
          </div>
        </ContainerLayout>
      </body>
    </html>
  );
}
