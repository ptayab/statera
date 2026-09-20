import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const stateraDisplay = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-statera-display",
});

const stateraBody = Inter({
  subsets: ["latin"],
  variable: "--font-statera-body",
});

export const metadata: Metadata = {
  title: "Statera | Safety reporting for mine sites",
  description:
    "Workers report mine-site hazards in about a minute, even offline. Supervisors see what is urgent first and follow every report through to done.",
  applicationName: "Statera",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "Statera | Keeping mines safe starts with a report",
    description:
      "Safety reporting for mine sites, built for underground and remote crews.",
    siteName: "Statera",
    images: [{ url: "/og.png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${stateraDisplay.variable} ${stateraBody.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
