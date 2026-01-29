import apiClient from "./api";
import type {
  LoginCredentials,
  LoginResponse,
  User,
  ApiResponse,
} from "@/types";

export const authService = {
  // Login user and get JWT token (Devise JWT format)
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await apiClient.post<ApiResponse<{ user: User }>>(
      "/api/v1/auth/login",
      {
        user: credentials, // Wrap credentials in "user" object for Devise
      },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      },
    );

    // Extract token from Authorization header (Devise JWT puts it there)
    // Check all possible header key variations
    const headers = response.headers;
    let authHeader = null;

    // Try different casing
    for (const key in headers) {
      if (key.toLowerCase() === "authorization") {
        authHeader = headers[key];
        break;
      }
    }

    if (!authHeader) {
      throw new Error(
        "No authorization token received from server. Please check backend configuration.",
      );
    }

    // Extract token and remove "Bearer " prefix
    const token = authHeader.replace(/^Bearer\s+/i, "").trim();

    // Extract user data from response
    const user = response.data.data?.user;

    if (!user) {
      throw new Error("Invalid response format from server");
    }

    return {
      token: token,
      user: user,
    };
  },

  // Logout user
  async logout(): Promise<void> {
    await apiClient.delete("/api/v1/auth/logout");
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
  },

  // Get current user info
  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<ApiResponse<User>>("/api/v1/auth/me");
    return response.data.data!;
  },

  // Save auth token to localStorage
  saveToken(token: string): void {
    localStorage.setItem("auth_token", token);
  },

  // Get auth token from localStorage
  getToken(): string | null {
    return localStorage.getItem("auth_token");
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};
