/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Home,
  CreditCard,
  FileText,
  Edit,
  User,
  Menu,
  X,
  DollarSign,
  Lock,
} from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { useAppSelector } from "@/store/hooks";
import { selectUser } from "@/store/selectors/authSelectors";
import { addMonths, isAfter, parseISO } from "date-fns";
import { useMemberStatus } from "@/utils/hooks/useMemberStatus";

// interface Notification {
//   read: boolean;
//   // other properties...
// }

export default function DashboardSidebar(props: React.ComponentProps<any>) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const user = useAppSelector(selectUser);
  const { isFrozen } = useMemberStatus();

  const createdDate = user?.createdAt ? parseISO(user.createdAt) : null;
  const sixMonthsLater = createdDate ? addMonths(createdDate, 6) : null;
  const isEligible = sixMonthsLater
    ? isAfter(new Date(), sixMonthsLater)
    : false;

  // Items disabled for inactive users
  const disabledItemsWhenInactive = ["payments", "loans"];
  const disabledItemsWhenFrozen = ["payments", "loans", "savings-withdraw", "overview"];

  // Sidebar menu items
  const sidebarItems = [
    { id: "overview", label: "Overview", icon: Home, path: "/dashboard" },
    {
      id: "payment",
      label: "Payment",
      icon: CreditCard,
      path: "/dashboard/payment",
    },
    {
      id: "loans",
      label: "Loans",
      icon: FileText,
      path: "/dashboard/apply-loan",
    },
    {
      id: "application",
      label: "Contact Admin",
      icon: Edit,
      path: "/dashboard/application-form",
    },
    {
      id: "savings-withdraw",
      label: "Savings Withdraw",
      icon: DollarSign,
      path: "/dashboard/savings-withdraw",
    },
    { id: "profile", label: "Profile", icon: User, path: "/dashboard/profile" },
  ];

  // Filter loans if not eligible
  const filteredSidebarItems = sidebarItems.filter(
    (item) => item.id !== "loans" || isEligible
  );

  const isActiveRoute = (path: string) => location.pathname === path;

  const isDisabled = (id: string) => {
    if (user?.active === false) {
      return disabledItemsWhenInactive.includes(id);
    }
    if (isFrozen) {
      return disabledItemsWhenFrozen.includes(id);
    }
    return false;
  };

  const getDisabledTooltip = (_id: string) => {
    if (user?.active === false) {
      return "Activate your account to access this";
    }
    if (isFrozen) {
      return "Contact admin to restore access";
    }
    return "";
  };

  const getStatusBadge = () => {
    if (isFrozen) {
      return (
        <div className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium mb-4 mx-4">
          Account Frozen
        </div>
      );
    }
    if (!user?.active) {
      return (
        <div className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium mb-4 mx-4">
          Account Inactive
        </div>
      );
    }
    return null;
  };

  if (props.isMobile) {
    return (
      <>
        {/* Mobile Menu Button */}
        <div className="lg:hidden mb-4">
          <Button
            variant="outline"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="w-full justify-between"
          >
            <span>Menu</span>
            {isMobileMenuOpen ? (
              <X className="w-4 h-4" />
            ) : (
              <Menu className="w-4 h-4" />
            )}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mb-6"
          >
            <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
              <CardContent className="p-0">
                {/* Status Badge */}
                {getStatusBadge()}
                
                <nav className="flex flex-col">
                  {filteredSidebarItems.map((item) => {
                    const disabled = isDisabled(item.id);
                    return (
                      <motion.div key={item.id} whileTap={{ scale: 0.98 }}>
                        {disabled ? (
                          <div
                            className="flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-400 cursor-not-allowed select-none"
                            title={getDisabledTooltip(item.id)}
                          >
                            <div className="flex items-center">
                              {item.icon && (
                                <item.icon className="mr-3 h-5 w-5" />
                              )}
                              {item.label}
                            </div>
                            {isFrozen && (
                              <Lock className="w-4 h-4 text-gray-400" />
                            )}
                          </div>
                        ) : (
                          <Link
                            to={item.path}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`flex items-center justify-between px-4 py-3 text-sm font-medium transition-all ${
                              isActiveRoute(item.path)
                                ? "bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 border-r-4 border-emerald-500"
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            }`}
                          >
                            <div className="flex items-center">
                              {item.icon && (
                                <item.icon className="mr-3 h-5 w-5" />
                              )}
                              {item.label}
                            </div>
                          </Link>
                        )}
                      </motion.div>
                    );
                  })}
                </nav>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </>
    );
  }

  // Desktop sidebar
  return (
    <motion.div
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="sticky top-24"
    >
      <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
        <CardContent className="p-0">
          {/* Status Badge */}
          {getStatusBadge()}
          
          <nav className="flex flex-col">
            {filteredSidebarItems.map((item) => {
              const disabled = isDisabled(item.id);
              return (
                <motion.div
                  key={item.id}
                  whileHover={{ x: disabled ? 0 : 5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {disabled ? (
                    <div
                      className="flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-400 cursor-not-allowed select-none"
                      title={getDisabledTooltip(item.id)}
                    >
                      <div className="flex items-center">
                        {item.icon && <item.icon className="mr-3 h-5 w-5" />}
                        {item.label}
                      </div>
                      {isFrozen && (
                        <Lock className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  ) : (
                    <Link
                      to={item.path}
                      className={`flex items-center justify-between px-4 py-3 text-sm font-medium transition-all ${
                        isActiveRoute(item.path)
                          ? "bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 border-r-4 border-emerald-500"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      <div className="flex items-center">
                        {item.icon && <item.icon className="mr-3 h-5 w-5" />}
                        {item.label}
                      </div>
                    </Link>
                  )}
                </motion.div>
              );
            })}
          </nav>

          {/* Help Section for Frozen Users */}
          {isFrozen && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="p-4 border-t border-gray-200"
            >
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-2">
                  Need help with your account?
                </p>
                <Link to="/dashboard/application-form">
                  <Button
                    size="sm"
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-xs"
                  >
                    <Edit className="w-3 h-3 mr-1" />
                    Contact Admin
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}