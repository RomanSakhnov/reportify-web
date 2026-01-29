<template>
  <div>
    <h1 class="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-20">
      <div class="spinner"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="card bg-red-50 border border-red-200">
      <p class="text-red-600">{{ error }}</p>
    </div>

    <!-- Dashboard Content -->
    <div v-else-if="dashboardData">
      <!-- Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="card">
          <h3 class="text-sm font-medium text-gray-600 mb-2">Total Users</h3>
          <p class="text-3xl font-bold text-gray-900">
            {{ dashboardData.summary.total_users }}
          </p>
          <p class="text-sm text-gray-500 mt-2">
            {{ dashboardData.summary.active_users }} active
          </p>
        </div>

        <div class="card">
          <h3 class="text-sm font-medium text-gray-600 mb-2">Total Items</h3>
          <p class="text-3xl font-bold text-gray-900">
            {{ dashboardData.summary.total_items }}
          </p>
          <p class="text-sm text-gray-500 mt-2">
            {{ dashboardData.summary.active_items }} active
          </p>
        </div>

        <div class="card">
          <h3 class="text-sm font-medium text-gray-600 mb-2">Total Value</h3>
          <p class="text-3xl font-bold text-gray-900">
            ${{ dashboardData.summary.total_value.toFixed(2) }}
          </p>
          <p class="text-sm text-gray-500 mt-2">Combined inventory</p>
        </div>

        <div class="card">
          <h3 class="text-sm font-medium text-gray-600 mb-2">Active Rate</h3>
          <p class="text-3xl font-bold text-gray-900">
            {{ calculateActiveRate() }}%
          </p>
          <p class="text-sm text-gray-500 mt-2">Items active</p>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Recent Users -->
        <div class="card">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Recent Users</h2>
          <div class="space-y-3">
            <div
              v-for="(user, index) in dashboardData.recent_activity
                .recent_users"
              :key="index"
              class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div>
                <p class="font-medium text-gray-900">{{ user[0] }}</p>
                <p class="text-sm text-gray-500">{{ user[1] }}</p>
              </div>
              <span class="text-xs text-gray-400">
                {{ formatDate(user[2]) }}
              </span>
            </div>
          </div>
        </div>

        <!-- Recent Items -->
        <div class="card">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Recent Items</h2>
          <div class="space-y-3">
            <div
              v-for="item in dashboardData.recent_activity.recent_items"
              :key="item.id"
              class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div>
                <p class="font-medium text-gray-900">{{ item.name }}</p>
                <p class="text-sm text-gray-500">
                  {{ item.category }} • {{ item.owner }}
                </p>
              </div>
              <span class="text-xs text-gray-400">
                {{ formatDate(item.created_at) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { reportService } from "@/services/report.service";
import { useLoading } from "@/composables/useLoading";
import type { DashboardData } from "@/types";

const { loading, error, withLoading } = useLoading();
const dashboardData = ref<DashboardData | null>(null);

onMounted(async () => {
  const data = await withLoading(() => reportService.getDashboard());
  if (data) {
    dashboardData.value = data;
  }
});

const calculateActiveRate = () => {
  if (!dashboardData.value) return 0;
  const { total_items, active_items } = dashboardData.value.summary;
  if (total_items === 0) return 0;
  return ((active_items / total_items) * 100).toFixed(1);
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return date.toLocaleDateString();
};
</script>
