import type { Metadata } from "next";
import ShopContent from "./ShopContent";

export const metadata: Metadata = {
  title: "Shop — Bespoke Epoxy & Resin Collection",
  description: "Browse our collection of handcrafted epoxy & resin furniture. Dining tables, coffee tables, wall art, clocks, and custom pieces. Every creation is one-of-one.",
};

export default function ShopPage() {
  return <ShopContent />;
}
