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
    "Workers report hazards, near misses, and incidents from the field. Supervisors receive a prioritized queue and track every ticket to resolution. Data is hosted in Canada.",
  applicationName: "Statera",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "Statera | Bring every hazard to the surface",
    description:
      "Safety reporting for mine sites, with fast field reporting, tickets tracked to resolution, and data hosted in Canada.",
    siteName: "Statera",
    images: [{ url: "/og.png" }],
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover" as const,
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
