<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-500 to-primary-700 px-4"
  >
    <div class="max-w-md w-full">
      <!-- Login Card -->
      <div class="bg-white rounded-2xl shadow-2xl p-8">
        <!-- Header -->
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Reportify</h1>
          <p class="text-gray-600">Sign in to your account</p>
        </div>

        <!-- Error Message -->
        <div
          v-if="error"
          class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
        >
          <p class="text-sm text-red-600">{{ error }}</p>
        </div>

        <!-- Login Form -->
        <form @submit.prevent="handleLogin" class="space-y-6">
          <div>
            <label
              for="email"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Email Address
            </label>
            <input
              id="email"
              v-model="credentials.email"
              type="email"
              required
              class="input"
              placeholder="admin@reportify.com"
            />
          </div>

          <div>
            <label
              for="password"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Password
            </label>
            <input
              id="password"
              v-model="credentials.password"
              type="password"
              required
              class="input"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full btn btn-primary flex items-center justify-center"
          >
            <span
              v-if="loading"
              class="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"
            ></span>
            {{ loading ? "Signing in..." : "Sign In" }}
          </button>
        </form>

        <!-- Demo Credentials -->
        <div class="mt-6 p-4 bg-gray-50 rounded-lg">
          <p class="text-xs text-gray-600 font-medium mb-2">
            Demo Credentials:
          </p>
          <p class="text-xs text-gray-500">Email: admin@reportify.com</p>
          <p class="text-xs text-gray-500">Password: password123</p>
        </div>
      </div>

      <!-- Footer -->
      <p class="text-center mt-6 text-sm text-white">
        &copy; 2024 Reportify. All rights reserved.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth.store";
import type { LoginCredentials } from "@/types";

const router = useRouter();
const authStore = useAuthStore();

const credentials = ref<LoginCredentials>({
  email: "",
  password: "",
});

const loading = ref(false);
const error = ref<string | null>(null);

const handleLogin = async () => {
  loading.value = true;
  error.value = null;

  const success = await authStore.login(credentials.value);

  loading.value = false;

  if (success) {
    // Small delay to ensure state is updated before navigation
    await new Promise((resolve) => setTimeout(resolve, 100));
    await router.push("/reports");
  } else {
    error.value = authStore.error || "Invalid email or password";
  }
};
</script>
