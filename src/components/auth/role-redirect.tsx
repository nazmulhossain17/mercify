import { useAppSelector } from "@/store/hooks";
import {
  selectAuthLoading,
  selectIsAuthenticated,
  selectUserRole,
} from "@/store/selectors/authSelectors";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

interface RoleRedirectProps {
  children: React.ReactNode;
}

export default function RoleRedirect({ children }: RoleRedirectProps) {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const userRole = useAppSelector(selectUserRole);
  const isLoading = useAppSelector(selectAuthLoading);

  useEffect(() => {
    if (isAuthenticated && userRole && !isLoading) {
      const currentPath = window.location.pathname;

      // Redirect based on role if user is on root path or sign-in
      if (currentPath === "/" || currentPath === "/sign-in") {
        if (userRole === "admin") {
          console.log("👑 Redirecting admin to admin dashboard");
          window.location.href = "/admin";
        } else if (userRole === "member") {
          console.log("👤 Redirecting member to dashboard");
          window.location.href = "/dashboard";
        }
      }
    }
  }, [isAuthenticated, userRole, isLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-emerald-600" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
