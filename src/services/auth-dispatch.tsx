/* eslint-disable @typescript-eslint/no-explicit-any */
import type { AppDispatch } from "@/store/store";
import {
  clearCredentials,
  clearError,
  setCredentials,
  setError,
  setLoading,
} from "@/store/slice/authSlice";
import type { LoginRequest, User } from "@/types/auth";
import { AuthService } from "./authService";

export class AuthDispatch {
  private dispatch: AppDispatch;

  constructor(dispatch: AppDispatch) {
    this.dispatch = dispatch;
  }

  // Login with API integration
  login = async (credentials: LoginRequest) => {
    try {
      console.log("🔐 AuthDispatch: Starting login process...");
      this.dispatch(setLoading(true));
      this.dispatch(clearError());

      // Call API
      const response = await AuthService.login(credentials);

      // Store credentials in Redux
      this.dispatch(
        setCredentials({
          accessToken: response.accessToken,
          user: response.user,
        })
      );

      // Store in localStorage for persistence
      localStorage.setItem("accessToken", response.accessToken);
      localStorage.setItem("user", JSON.stringify(response.user));

      console.log(
        "✅ AuthDispatch: Login successful for:",
        response.user.email
      );
      this.dispatch(setLoading(false));

      return {
        success: true,
        user: response.user,
        message: response.message,
      };
    } catch (error: any) {
      console.error("❌ AuthDispatch: Login failed:", error.message);
      this.dispatch(setError(error.message));
      return {
        success: false,
        error: error.message,
      };
    }
  };

  // Logout with API integration
  logout = async () => {
    try {
      console.log("🚪 AuthDispatch: Starting logout process...");
      this.dispatch(setLoading(true));

      // Call API logout (optional)
      try {
        await AuthService.logout();
      } catch (error) {
        console.log(
          "⚠️ API logout failed, continuing with local logout",
          error
        );
      }

      // Clear Redux state
      this.dispatch(clearCredentials());

      // Clear localStorage
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");

      console.log("✅ AuthDispatch: Logout successful");
      this.dispatch(setLoading(false));

      return { success: true };
    } catch (error: any) {
      console.error("❌ AuthDispatch: Logout error:", error.message);
      this.dispatch(setError(error.message));
      return { success: false, error: error.message };
    }
  };

  // Initialize auth from localStorage and validate session
  initializeAuth = async () => {
    try {
      console.log("🔄 AuthDispatch: Initializing auth...");
      this.dispatch(setLoading(true));
      this.dispatch(clearError());

      const accessToken = localStorage.getItem("accessToken");
      const userString = localStorage.getItem("user");

      if (accessToken && userString) {
        const user: User = JSON.parse(userString);

        // Validate session with API
        const isValid = await AuthService.validateSession();

        if (isValid) {
          this.dispatch(setCredentials({ accessToken, user }));
          console.log(
            "✅ AuthDispatch: Auth initialized for user:",
            user.email
          );
        } else {
          console.log("❌ AuthDispatch: Stored session invalid, clearing...");
          localStorage.removeItem("accessToken");
          localStorage.removeItem("user");
        }
      } else {
        console.log("ℹ️ AuthDispatch: No stored credentials found");
      }

      this.dispatch(setLoading(false));
      return { success: true };
    } catch (error: any) {
      console.error(
        "❌ AuthDispatch: Auth initialization error:",
        error.message
      );
      this.dispatch(setError(error.message));

      // Clear potentially invalid stored data
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");

      return { success: false, error: error.message };
    }
  };

  // Refresh token
  refreshToken = async () => {
    try {
      console.log("🔄 AuthDispatch: Refreshing token...");

      const response = await AuthService.refreshToken();
      const currentUser = localStorage.getItem("user");

      if (currentUser) {
        const user: User = JSON.parse(currentUser);

        // Update Redux state
        this.dispatch(
          setCredentials({
            accessToken: response.accessToken,
            user,
          })
        );

        // Update localStorage
        localStorage.setItem("accessToken", response.accessToken);

        console.log("✅ AuthDispatch: Token refreshed successfully");
        return { success: true, accessToken: response.accessToken };
      }

      throw new Error("No user data found");
    } catch (error: any) {
      console.error("❌ AuthDispatch: Token refresh failed:", error.message);

      // Clear auth on refresh failure
      this.dispatch(clearCredentials());
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");

      return { success: false, error: error.message };
    }
  };

  // Clear errors
  clearAuthError = () => {
    console.log("🧹 AuthDispatch: Clearing auth error");
    this.dispatch(clearError());
  };

  // Set loading state
  setAuthLoading = (loading: boolean) => {
    console.log(`⏳ AuthDispatch: Setting loading: ${loading}`);
    this.dispatch(setLoading(loading));
  };
}

// Factory function
export const createAuthDispatch = (dispatch: AppDispatch): AuthDispatch => {
  return new AuthDispatch(dispatch);
};
