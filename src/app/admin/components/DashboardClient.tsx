"use client";

import { useState } from "react";
import AdminShell from "./AdminShell";
import OverviewTab from "./OverviewTab";
import ProductsTab from "./ProductsTab";
import CategoriesTab from "./CategoriesTab";
import InstagramTab from "./InstagramTab";
import OrdersTab from "./OrdersTab";
import EnquiriesTab from "./EnquiriesTab";

type Tab = "overview" | "products" | "categories" | "instagram" | "orders" | "enquiries";

const tabComponents: Record<string, React.ReactNode> = {
  overview: <OverviewTab />,
  products: <ProductsTab />,
  categories: <CategoriesTab />,
  instagram: <InstagramTab />,
  orders: <div className="p-8 text-cream">Orders Management (Coming Soon)</div>,
  enquiries: <EnquiriesTab />,
};

export default function DashboardClient() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  return (
    <AdminShell activeTab={activeTab} setActiveTab={setActiveTab}>
      <div className="mt-8">
        {activeTab === "overview" && <OverviewTab />}
        {activeTab === "products" && <ProductsTab />}
        {activeTab === "categories" && <CategoriesTab />}
        {activeTab === "orders" && <OrdersTab />}
        {activeTab === "enquiries" && <EnquiriesTab />}
      </div>
    </AdminShell>
  );
}
