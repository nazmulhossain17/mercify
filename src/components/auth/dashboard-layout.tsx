import { useAppSelector } from "@/store/hooks";
import { selectUser } from "@/store/selectors/authSelectors";

import { Outlet } from "react-router-dom";
import DashboardHeader from "../Dashboard/header";
import DashboardSidebar from "../Dashboard/sidebar";
import Footer from "../Footer/Footer";
import { useMemberStatus } from "@/utils/hooks/useMemberStatus";
import { useEffect, useState } from "react";
import RestrictedOverlay from "../modal/RestrictedOverlay";
import RestrictedAccessModal from "../modal/RestrictedModal";

const DashboardLayout = () => {
  const user = useAppSelector(selectUser);
  const { isFrozen, shouldRestrictAccess } = useMemberStatus();
  
  const [showRestrictionModal, setShowRestrictionModal] = useState(false);
  const [hasShownModal, setHasShownModal] = useState(false);

  const notifications = [
    { id: 1, message: "Payment received", read: false },
    { id: 2, message: "Loan approved", read: false },
  ];

  // Show modal on login if account is frozen
  useEffect(() => {
    if (isFrozen && !hasShownModal) {
      const timer = setTimeout(() => {
        setShowRestrictionModal(true);
        setHasShownModal(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [isFrozen, hasShownModal]);

  if (!user) {
    return <div>User not found</div>;
  }

  // Fix: Convert boolean to the expected string type
  // const status = isFrozen ? "freez" : "active";

  return (
    <div className="min-h-screen bg-green-50">
      <DashboardHeader
        user={user}
        notifications={notifications}
        onNotificationClick={() => console.log("Notification clicked")}
      />
      
      <div className="flex relative">
        <div className="w-69 m-5">
          <DashboardSidebar />
        </div>
        
        <main className="flex-1 p-6 relative">
          {/* Restricted Overlay */}
          {shouldRestrictAccess && (
            <RestrictedOverlay
              isRestricted={shouldRestrictAccess} 
               status='freez'
            />
          )}
          
          {/* Main Content with conditional blur */}
          <div className={shouldRestrictAccess ? 'filter blur-sm pointer-events-none' : ''}>
            <Outlet />
          </div>
        </main>
      </div>
      
      <Footer />

      {/* Restriction Modal - Only show if frozen */}
      {isFrozen && (
        <RestrictedAccessModal
  isOpen={showRestrictionModal}
  onClose={() => setShowRestrictionModal(false)}
  isFrozen={isFrozen} // Now passing boolean directly
/>
      )}
    </div>
  );
};

export default DashboardLayout;