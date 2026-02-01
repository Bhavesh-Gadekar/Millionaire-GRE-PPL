import Sidebar from "@/components/admin/Sidebar";

// uncomment below if want to test middlware :-

// import { getCurrentSession } from "@/actions/admin_B/auth.actions";
// import { redirect } from "next/navigation";

export default async function AdminLayout({ children }) {
  // const session = await getCurrentSession();
  // if (!session) redirect("/admin/login");

  return (
    <div className="min-h-screen flex bg-slate-50">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">{children}</main>
    </div>
  );
}
