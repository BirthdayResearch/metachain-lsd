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
      <main className="md:max-w-5xl">{children}</main>
    </ContainerLayout>
  );
}
