import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { authService } from "@/services/auth.service";
import type { User, LoginCredentials } from "@/types";

// Auth store for managing authentication state
// Uses Pinia Composition API style
export const useAuthStore = defineStore("auth", () => {
  // State
  const user = ref<User | null>(null);
  const token = ref<string | null>(authService.getToken());
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Getters
  const isAuthenticated = computed(() => !!token.value && !!user.value);
  const isAdmin = computed(() => user.value?.role === "admin");

  // Actions
  async function login(credentials: LoginCredentials) {
    loading.value = true;
    error.value = null;

    try {
      const response = await authService.login(credentials);

      // Validate response has required data
      if (!response || !response.token || !response.user) {
        throw new Error(
          "Invalid response from auth service - missing token or user data",
        );
      }

      // Save token and user data
      token.value = response.token;
      user.value = response.user;
      authService.saveToken(response.token);
      localStorage.setItem("user", JSON.stringify(response.user));

      return true;
    } catch (err: any) {
      // Extract error message
      const errorMessage =
        err.message ||
        err.response?.data?.message ||
        "Login failed. Please try again.";

      error.value = errorMessage;

      return false;
    } finally {
      loading.value = false;
    }
  }

  async function logout() {
    try {
      await authService.logout();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      token.value = null;
      user.value = null;
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user");
    }
  }

  async function checkAuth() {
    if (!token.value) {
      return false;
    }

    try {
      const userData = await authService.getCurrentUser();
      user.value = userData;
      return true;
    } catch (err) {
      token.value = null;
      user.value = null;
      return false;
    }
  }

  // Initialize user from localStorage if token exists
  function initializeAuth() {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("auth_token");

    if (storedUser && storedToken) {
      try {
        user.value = JSON.parse(storedUser);
        token.value = storedToken;
      } catch (error) {
        localStorage.removeItem("user");
        localStorage.removeItem("auth_token");
      }
    }
  }

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    isAdmin,
    login,
    logout,
    checkAuth,
    initializeAuth,
  };
});
