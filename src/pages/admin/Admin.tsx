import { AdminLayout } from "@/components/auth/admin-layout";


import { Outlet } from "react-router-dom";

export default function Admin() {
  return (
    <>
      <div className="min-h-screen flex flex-col">
      <AdminLayout>
        <Outlet />
      </AdminLayout>

    </div>
    </>
  );
}
