import { AdminLayout } from "@/components/auth/admin-layout";
import Footer from "@/components/Footer/Footer";

import { Outlet } from "react-router-dom";

export default function Admin() {
  return (
    <>
      <AdminLayout>
        <Outlet />
      </AdminLayout>
      <Footer />
    </>
  );
}
