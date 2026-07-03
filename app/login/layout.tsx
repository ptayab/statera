import { Bebas_Neue, Inter } from "next/font/google";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-statera-display",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-statera-body",
});

export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className={`${bebasNeue.variable} ${inter.variable} min-h-screen font-body antialiased`}
    >
      {children}
    </div>
  );
}
