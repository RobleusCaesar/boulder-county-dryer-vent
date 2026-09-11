import type { Metadata } from "next";
import { Fraunces, Source_Sans_3 } from "next/font/google";
import { brand, homepageCopy } from "@/lib/brand";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { MobileBookBar } from "@/components/site/MobileBookBar";
import "./globals.css";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const sans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const titleDefault = `${brand.name} — ${homepageCopy.h1}`;

export const metadata: Metadata = {
  title: {
    default: titleDefault,
    template: `%s · ${brand.name}`,
  },
  description: homepageCopy.subhead,
  icons: { icon: "/favicon.svg" },
  applicationName: brand.name,
  robots: { index: true, follow: true },
  openGraph: {
    title: titleDefault,
    description: homepageCopy.subhead,
    locale: "en_US",
    type: "website",
    siteName: brand.name,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body className="min-h-screen pb-20 md:pb-0">
        <Header />
        <main>{children}</main>
        <Footer />
        <MobileBookBar />
      </body>
    </html>
  );
}
