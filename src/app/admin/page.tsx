import { getAdminSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardClient from "./components/DashboardClient";

export default async function AdminDashboard() {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  return <DashboardClient />;
}
