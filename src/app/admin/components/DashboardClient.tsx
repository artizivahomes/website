"use client";

import { useState } from "react";
import AdminShell from "./AdminShell";
import OverviewTab from "./OverviewTab";
import ProductsTab from "./ProductsTab";
import OrdersTab from "./OrdersTab";
import EnquiriesTab from "./EnquiriesTab";

type Tab = "overview" | "products" | "orders" | "enquiries";

export default function DashboardClient() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  return (
    <AdminShell activeTab={activeTab} setActiveTab={setActiveTab}>
      <div className="mt-8">
        {activeTab === "overview" && <OverviewTab />}
        {activeTab === "products" && <ProductsTab />}
        {activeTab === "orders" && <OrdersTab />}
        {activeTab === "enquiries" && <EnquiriesTab />}
      </div>
    </AdminShell>
  );
}
