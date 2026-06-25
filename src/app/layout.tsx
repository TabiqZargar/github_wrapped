import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains-mono" });

export const metadata: Metadata = {
  title: "GitHub Wrapped | Your Year in Code",
  description: "A cinematic review of your repositories, contributions, and engineering impact. Discover your story told through every commit, pull request, and late-night merge.",
  keywords: ["github", "wrapped", "developer", "stats", "coding", "year in review"],
  openGraph: {
    title: "GitHub Wrapped | Your Year in Code",
    description: "A cinematic review of your repositories, contributions, and engineering impact.",
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
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans`}>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
