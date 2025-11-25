import type { Metadata } from "next";
import "@/styles/globals.css";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "planEd",
  description:
    "მართე სასწავლო გეგმა, მოდულები და საათობრივი ბადე მარტივად და ეფექტურად — PlanEd ვებ აპლიკაცია კოლეჯებისთვისა და სკოლებისთვის.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        <Header />
        <main className="p-6">{children}</main>
      </body>
    </html>
  );
}
