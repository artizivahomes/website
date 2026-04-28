import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Panel | Artiziva Homes",
  description: "Management dashboard for Artiziva Homes",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-root bg-bg-primary text-text-primary min-h-screen">
      {children}
    </div>
  );
}
