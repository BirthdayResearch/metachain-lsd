import type { Metadata } from "next";
import "./globals.css";
import ContainerLayout from "@/app/ui/components/ContainerLayout";

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
    <ContainerLayout>
      <main className="max-w-full md:max-w-[1120px] flex flex-row">
        {children}
      </main>
    </ContainerLayout>
  );
}
