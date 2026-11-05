import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

const neueHaas = localFont({
  src: "../../public/assets/fonts/neuehaasgrot.woff2",
  variable: "--font-neue",
  display: "swap",
});

const nevera = localFont({
  src: "../../public/assets/fonts/Nevera-Regular.woff2",
  variable: "--font-nevera",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Asif Book Store — Books, Uniforms, Gadgets & Watches",
  description:
    "Asif Book Store is a mega-mart for books, school uniforms, electronic gadgets and watches — Authorized Dealer for uniforms & course books of The City School and other reputed schools.",
  icons: { icon: "/assets/images/logo.jpeg" },
};

export const viewport: Viewport = {
  themeColor: "#00227a",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${neueHaas.variable} ${nevera.variable} antialiased`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
