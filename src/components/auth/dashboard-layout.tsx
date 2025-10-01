import { useAppSelector } from "@/store/hooks";
import { selectUser } from "@/store/selectors/authSelectors";

import { Outlet } from "react-router-dom";
import DashboardHeader from "../Dashboard/header";
import DashboardSidebar from "../Dashboard/sidebar";
import Footer from "../Footer/Footer";

const DashboardLayout = () => {
  const user = useAppSelector(selectUser);
  if (!user) {
    // Handle the case where user is null
    return <div>User not found</div>;
  }
  const notifications = [
    { id: 1, message: "Payment received", read: false },
    { id: 2, message: "Loan approved", read: false },
  ];

  return (
    <div className="min-h-screen bg-green-50">
      <DashboardHeader
        user={user}
        notifications={notifications}
        onNotificationClick={() => console.log("Notification clicked")}
      />
      <div className="flex">
        <div className="w-69 m-5">
          <DashboardSidebar notifications={notifications} />
        </div>
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default DashboardLayout;
