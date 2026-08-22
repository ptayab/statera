import type { Metadata } from "next";
import { Bebas_Neue, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";

const stateraDisplay = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-statera-display",
});

const stateraBody = Inter({
  subsets: ["latin"],
  variable: "--font-statera-body",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Statera",
  description: "Safety reporting for mine sites",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${stateraDisplay.variable} ${stateraBody.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
