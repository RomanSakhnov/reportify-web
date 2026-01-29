<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation Bar -->
    <nav class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <!-- Logo and Nav Links -->
          <div class="flex">
            <div class="flex-shrink-0 flex items-center">
              <h1 class="text-xl font-bold text-primary-600">Reportify</h1>
            </div>
            <div class="hidden sm:ml-8 sm:flex sm:space-x-8">
              <router-link
                to="/"
                class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                :class="
                  isActive('/')
                    ? 'border-primary-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                "
              >
                Dashboard
              </router-link>
              <router-link
                to="/reports"
                class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                :class="
                  isActive('/reports')
                    ? 'border-primary-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                "
              >
                Reports
              </router-link>
              <router-link
                to="/users"
                class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                :class="
                  isActive('/users')
                    ? 'border-primary-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                "
              >
                Users
              </router-link>
              <router-link
                to="/items"
                class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                :class="
                  isActive('/items')
                    ? 'border-primary-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                "
              >
                Items
              </router-link>
            </div>
          </div>

          <!-- User Menu -->
          <div class="flex items-center">
            <div class="flex items-center space-x-4">
              <span class="text-sm text-gray-700">
                {{ authStore.user?.name }}
                <span
                  v-if="authStore.isAdmin"
                  class="ml-2 px-2 py-1 text-xs bg-primary-100 text-primary-800 rounded"
                >
                  Admin
                </span>
              </span>
              <button @click="handleLogout" class="btn btn-secondary text-sm">
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Mobile menu -->
      <div class="sm:hidden px-2 pt-2 pb-3 space-y-1">
        <router-link
          to="/"
          class="block px-3 py-2 rounded-md text-base font-medium"
          :class="
            isActive('/')
              ? 'bg-primary-50 text-primary-700'
              : 'text-gray-700 hover:bg-gray-50'
          "
        >
          Dashboard
        </router-link>
        <router-link
          to="/reports"
          class="block px-3 py-2 rounded-md text-base font-medium"
          :class="
            isActive('/reports')
              ? 'bg-primary-50 text-primary-700'
              : 'text-gray-700 hover:bg-gray-50'
          "
        >
          Reports
        </router-link>
        <router-link
          to="/users"
          class="block px-3 py-2 rounded-md text-base font-medium"
          :class="
            isActive('/users')
              ? 'bg-primary-50 text-primary-700'
              : 'text-gray-700 hover:bg-gray-50'
          "
        >
          Users
        </router-link>
        <router-link
          to="/items"
          class="block px-3 py-2 rounded-md text-base font-medium"
          :class="
            isActive('/items')
              ? 'bg-primary-50 text-primary-700'
              : 'text-gray-700 hover:bg-gray-50'
          "
        >
          Items
        </router-link>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "@/stores/auth.store";

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const isActive = (path: string) => {
  return route.path === path;
};

const handleLogout = async () => {
  await authStore.logout();
  router.push("/login");
};
</script>
