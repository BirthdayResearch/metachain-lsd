import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import ContainerLayout from "@/app/ui/components/ContainerLayout";

const inter = Space_Grotesk({ subsets: ["latin"] });

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
      <body className={`${inter.className}`}>
        <ContainerLayout>
          <main
            className={`max-w-5xl w-full flex flex-row items-center justify-between`}
          >
            {children}
          </main>
        </ContainerLayout>
      </body>
    </html>
  );
}
