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
    "Workers report hazards, near misses, and incidents from the field. Supervisors get a ranked queue and close every ticket. Data stays in Canada.",
  applicationName: "Statera",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "Statera | Keeping mines safe starts with a report",
    description:
      "Safety reporting for mine sites. Field reporting, closed tickets, and data hosted in Canada.",
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
