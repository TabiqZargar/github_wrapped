import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "GitHub Wrapped",
  description: "Your yearly GitHub journey, beautifully visualized. See your coding stats, top languages, contributions, and more.",
  keywords: ["github", "wrapped", "developer", "stats", "coding", "year in review"],
  openGraph: {
    title: "GitHub Wrapped",
    description: "Your yearly GitHub journey, beautifully visualized.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
