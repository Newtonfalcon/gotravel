import { requireAdmin } from "@/lib/auth";
import AdminSidebar from "@/components/admin/AdminSideBar";

export const metadata = {
  title: "GoTravel Admin",
};

export default async function AdminLayout({ children }) {
 
  await requireAdmin();

  return (
    <div className="flex h-screen overflow-hidden bg-stone-900">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}