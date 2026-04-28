import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/cart/CartProvider";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Artiziva Homes — Bespoke Epoxy & Resin Furniture",
    template: "%s | Artiziva Homes",
  },
  description: "Handcrafted bespoke epoxy & resin furniture and artworks by Artiziva Homes.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${playfair.variable} ${inter.variable} font-sans antialiased bg-bg-primary text-text-primary selection:bg-gold/30 selection:text-gold`}
      >
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
