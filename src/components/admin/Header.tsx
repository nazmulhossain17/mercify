/* eslint-disable @typescript-eslint/no-explicit-any */
import { Bell, LogOut, Menu, Search, User } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useState } from "react";
import { useAppDispatch } from "@/store/hooks";
import { createAuthDispatch } from "@/services/auth-dispatch";
import { AuthService } from "@/services/authService";
import { toast } from "sonner";

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
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
    <header className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Left side */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input placeholder="Search..." className="pl-10 w-64" />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              3
            </span>
          </Button>

          <Button variant="ghost" size="sm">
            <User className="h-5 w-5" />
          </Button>

          {/* Logout button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="disabled:opacity-50"
          >
            <LogOut className="h-5 w-5 mr-1" />
            {isLoggingOut ? "Logging out..." : "Logout"}
          </Button>
        </div>
      </div>
    </header>
  );
}
