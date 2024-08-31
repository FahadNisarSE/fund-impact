import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { Inter, Borel } from "next/font/google";

import Providers from "@/utils/Providers";
import { auth } from "../../auth";
import "./globals.css";
import Navbar from "@/components/Navbar/Navbar";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });
export const borel = Borel({
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fund Impact",
  description: "Start with Greate Ideas",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <SessionProvider session={session}>
            <Navbar />
            {children}
            <Toaster position="bottom-center" />
          </SessionProvider>
        </Providers>
      </body>
    </html>
  );
}
