import { requireAuth } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Dashboard — GoTravel",
};

export default async function DashboardLayout({ children }) {
  // Fetch user from DB. Redirects to /sign-in if not authenticated.
  const user = await requireAuth();

  // Admins don't belong on the dashboard — send them to the admin panel.
  if (user.role === "admin") redirect("/admin");

  return <>{children}</>;
}