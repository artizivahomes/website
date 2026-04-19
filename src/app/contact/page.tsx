import type { Metadata } from "next";
import ContactContent from "./ContactContent";

export const metadata: Metadata = {
  title: "Bring Your Vision To Life — Contact Us",
  description: "Share your requirements and let Artiziva Homes create a functional resin masterpiece for your space. Handcrafted bespoke luxury furniture.",
};

export default function ContactPage() {
  return <ContactContent />;
}
