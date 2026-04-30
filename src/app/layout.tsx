import type { Metadata } from "next";
import {
  Inter,
  Cairo,
  Tajawal,
  Almarai,
  Rubik,
  Noto_Sans_Arabic,
  IBM_Plex_Sans_Arabic,
  Readex_Pro,
  El_Messiri,
  Amiri,
  Changa,
} from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  display: "swap",
});

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["200", "300", "400", "500", "700", "800", "900"],
  variable: "--font-tajawal",
  display: "swap",
});

const almarai = Almarai({
  subsets: ["arabic"],
  weight: ["300", "400", "700", "800"],
  variable: "--font-almarai",
  display: "swap",
});

const rubik = Rubik({
  subsets: ["arabic", "latin"],
  variable: "--font-rubik",
  display: "swap",
});

const notoSansArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  variable: "--font-noto-sans-arabic",
  display: "swap",
});

const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  variable: "--font-ibm-plex-arabic",
  display: "swap",
});

const readexPro = Readex_Pro({
  subsets: ["arabic", "latin"],
  variable: "--font-readex-pro",
  display: "swap",
});

const elMessiri = El_Messiri({
  subsets: ["arabic", "latin"],
  variable: "--font-el-messiri",
  display: "swap",
});

const amiri = Amiri({
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-amiri",
  display: "swap",
});

const changa = Changa({
  subsets: ["arabic", "latin"],
  variable: "--font-changa",
  display: "swap",
});

const fontVariables = [
  inter.variable,
  cairo.variable,
  tajawal.variable,
  almarai.variable,
  rubik.variable,
  notoSansArabic.variable,
  ibmPlexSansArabic.variable,
  readexPro.variable,
  elMessiri.variable,
  amiri.variable,
  changa.variable,
].join(" ");

export const metadata: Metadata = {
  title: "Safahati — Build Your Website in Minutes",
  description:
    "Multi-tenant, config-driven website platform. One codebase, infinite websites.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${fontVariables} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
