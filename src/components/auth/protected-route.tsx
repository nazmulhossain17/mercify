import { createAuthDispatch } from "@/store/dispatch/authDispatch";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  selectAuthLoading,
  selectIsAuthenticated,
  selectUser,
  selectUserRole,
} from "@/store/selectors/authSelectors";
import { Loader2 } from "lucide-react";
import { type ReactNode, useEffect } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: string;
  fallbackPath?: string;
}

export default function ProtectedRoute({
  children,
  requiredRole,
  fallbackPath = "/sign-in",
}: ProtectedRouteProps) {
  const dispatch = useAppDispatch();
  const authDispatch = createAuthDispatch(dispatch);

  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isLoading = useAppSelector(selectAuthLoading);
  const user = useAppSelector(selectUser);
  const userRole = useAppSelector(selectUserRole);

  useEffect(() => {
    // Initialize auth on component mount
    if (!isAuthenticated && !isLoading) {
      console.log("🔄 ProtectedRoute: Initializing auth...");
      authDispatch.initializeAuth();
    }
  }, [isAuthenticated, isLoading, authDispatch]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-emerald-600" />
          <p className="text-gray-600">Verifying your session...</p>
        </div>
      </div>
    );
  }

  // Redirect to sign-in if not authenticated
  if (!isAuthenticated) {
    console.log(
      "❌ ProtectedRoute: User not authenticated, redirecting to sign-in"
    );
    window.location.href = fallbackPath;
    return null;
  }

  // Check role-based access if required
  if (requiredRole && userRole !== requiredRole) {
    console.log(
      `❌ ProtectedRoute: User role '${userRole}' doesn't match required role '${requiredRole}'`
    );

    // Redirect based on user's actual role
    if (userRole === "admin") {
      window.location.href = "/admin";
    } else if (userRole === "member") {
      window.location.href = "/dashboard";
    } else {
      window.location.href = "/sign-in";
    }
    return null;
  }

  console.log(
    `✅ ProtectedRoute: Access granted for user '${user?.email}' with role '${userRole}'`
  );
  return <>{children}</>;
}
