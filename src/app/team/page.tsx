import type { Metadata } from "next";
import TeamContent from "./TeamContent";

export const metadata: Metadata = {
  title: "Our Team — Meet the Makers",
  description:
    "Meet the founders and artisans behind Artiziva Homes. Shubham Jhawar & Riya Agarwal — handcrafting bespoke epoxy & resin masterpieces since 2024.",
};

export default function TeamPage() {
  return <TeamContent />;
}
