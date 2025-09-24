/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bell, LogOut, Gift, Menu, X } from "lucide-react";
import { useAppDispatch } from "@/store/hooks";
import { createAuthDispatch } from "@/services/auth-dispatch";
import { toast } from "sonner";
import { AuthService } from "@/services/authService";

interface DashboardUser {
  _id?: string;
  id?: string;
  fullName: string;
  email: string;
  hasAppliedForLoan?: boolean;
  lastApplicationDate?: string;
}

interface DashboardHeaderProps {
  user: DashboardUser;
  notifications: any[];
  onNotificationClick: () => void;
}

export default function DashboardHeader({
  user,
  notifications,
  onNotificationClick,
}: DashboardHeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const dispatch = useAppDispatch();

  const authDispatch = createAuthDispatch(dispatch);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      console.log("🚪 Starting logout process...");

      // Call the API logout endpoint
      try {
        await AuthService.logout();
        console.log("✅ API logout successful");
      } catch (apiError) {
        console.log(
          "⚠️ API logout failed, continuing with local logout:",
          apiError
        );
      }

      // Clear Redux state regardless of API call result
      const result = await authDispatch.logout();

      if (result.success) {
        console.log("✅ Local logout successful");
        toast.success("Logged out successfully!");

        // Small delay to show the toast, then redirect
        setTimeout(() => {
          window.location.href = "/sign-in";
        }, 1000);
      } else {
        console.error("❌ Local logout failed:", result.error);
        toast.error(result.error || "Logout failed. Please try again.");
      }
    } catch (error: any) {
      console.error("💥 Logout error:", error);
      toast.error("An error occurred during logout. Please try again.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="bg-white/90 backdrop-blur-md border-b border-emerald-100 sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
              className="flex items-center space-x-2"
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="w-8 h-8 rounded-lg flex items-center justify-center"
              >
                <img
                  src="/images/logo.png"
                  alt="Mercy Financials"
                  className="h-10 w-auto object-contain"
                />
              </motion.div>
              <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Mercy Financials
              </span>
            </motion.div>
          </Link>

          {/* Desktop Header Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={onNotificationClick}
                className="relative"
              >
                <Bell className="w-5 h-5" />
                {notifications.filter((n) => !n.read).length > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                    {notifications.filter((n) => !n.read).length}
                  </span>
                )}
              </Button>
            </div>

            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
                  {user.fullName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="hidden lg:block">
                <p className="text-sm font-medium text-gray-900">
                  {user.fullName}
                </p>
                <p className="text-xs text-gray-500">Good Standing</p>
              </div>
              <div>
                <Link
                  to="/donation"
                  className="flex items-center space-x-2 text-sm font-medium text-gray-900"
                >
                  <Gift className="w-4 h-4" />
                  <span>Donation</span>
                </Link>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="disabled:opacity-50"
            >
              <LogOut className="w-4 h-4 mr-2" />
              {isLoggingOut ? "Logging out..." : "Logout"}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Header Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden bg-white border-t border-emerald-100 overflow-hidden"
        >
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
                  {user.fullName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {user.fullName}
                </p>
                <p className="text-xs text-gray-500">Good Standing</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Link
                to="/donation"
                className="flex items-center space-x-2 text-sm font-medium text-gray-900"
              >
                <Gift className="w-4 h-4" />
                <span>Donation</span>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="disabled:opacity-50"
              >
                <LogOut className="w-4 h-4" />
                {isLoggingOut ? "..." : "Logout"}
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}
