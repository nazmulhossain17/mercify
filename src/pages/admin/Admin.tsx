import { AdminLayout } from "@/components/auth/admin-layout";

import { Outlet } from "react-router-dom";

export default function Admin() {
  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  );
}
