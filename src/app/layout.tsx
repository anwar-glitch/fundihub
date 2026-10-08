import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FundiHub — Find a Trusted Fundi Near You",
  description:
    "FundiHub connects customers with skilled local service professionals.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}