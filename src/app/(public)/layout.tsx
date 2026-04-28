import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import CartSidebar from "@/components/cart/CartSidebar";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pb-20 md:pb-0">{children}</main>
      <Footer />
      <MobileBottomNav />
      <CartSidebar />
    </>
  );
}
