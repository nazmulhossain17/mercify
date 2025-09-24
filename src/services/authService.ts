/* eslint-disable @typescript-eslint/no-explicit-any */
import type { LoginRequest, LoginResponse, MemberProfile } from "@/types/auth";

export class AuthService {
  private static getAuthHeaders() {
    const token = localStorage.getItem("accessToken");
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  static async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/member/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
        credentials: "include", // Include cookies for refresh token
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Login failed");
    }

    return response.json();
  }

  static async logout(): Promise<void> {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/auth/logout`,
      {
        method: "POST",
        headers: this.getAuthHeaders(),
        credentials: "include",
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Logout failed");
    }
  }

  static async refreshToken(): Promise<{ accessToken: string }> {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/auth/refresh`,
      {
        method: "POST",
        credentials: "include",
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Token refresh failed");
    }

    return response.json();
  }

  static async validateSession(): Promise<boolean> {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/validate`,
        {
          method: "GET",
          headers: this.getAuthHeaders(),
          credentials: "include",
        }
      );

      return response.ok;
    } catch {
      return false;
    }
  }

  static async getMemberProfile(id: string): Promise<MemberProfile> {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/member/${id}`,
      {
        method: "GET",
        headers: this.getAuthHeaders(),
        credentials: "include",
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch member profile");
    }

    return response.json();
  }
}
