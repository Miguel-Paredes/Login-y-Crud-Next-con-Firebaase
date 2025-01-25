import type { Metadata } from "next";

import "./globals.css";
import { inter } from "@/config/Fonts";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Repaso de Next.js",
  description: "Web hecha para repasar Next con Firebase.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} antialiased p-0 m-0`}
      >
        {children}
        <Toaster/>
      </body>
    </html>
  );
}
