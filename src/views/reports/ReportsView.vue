<template>
  <div>
    <h1 class="text-3xl font-bold text-gray-900 mb-8">Reports & Analytics</h1>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-20">
      <div class="spinner"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="card bg-red-50 border border-red-200">
      <p class="text-red-600">{{ error }}</p>
    </div>

    <!-- Reports Content -->
    <div v-else class="space-y-8">
      <!-- Trend Cards -->
      <div v-if="trendsData" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="card">
          <h3 class="text-sm font-medium text-gray-600 mb-4">
            User Trend (30 days)
          </h3>
          <div class="flex items-end justify-between">
            <div>
              <p class="text-3xl font-bold text-gray-900">
                {{ trendsData.user_trend.current }}
              </p>
              <p class="text-sm text-gray-500 mt-1">New users</p>
            </div>
            <div
              class="text-right"
              :class="
                trendsData.user_trend.change_percentage >= 0
                  ? 'text-green-600'
                  : 'text-red-600'
              "
            >
              <p class="text-2xl font-bold">
                {{ trendsData.user_trend.change_percentage >= 0 ? "+" : ""
                }}{{ trendsData.user_trend.change_percentage }}%
              </p>
              <p class="text-sm">vs previous period</p>
            </div>
          </div>
        </div>

        <div class="card">
          <h3 class="text-sm font-medium text-gray-600 mb-4">
            Item Trend (30 days)
          </h3>
          <div class="flex items-end justify-between">
            <div>
              <p class="text-3xl font-bold text-gray-900">
                {{ trendsData.item_trend.current }}
              </p>
              <p class="text-sm text-gray-500 mt-1">New items</p>
            </div>
            <div
              class="text-right"
              :class="
                trendsData.item_trend.change_percentage >= 0
                  ? 'text-green-600'
                  : 'text-red-600'
              "
            >
              <p class="text-2xl font-bold">
                {{ trendsData.item_trend.change_percentage >= 0 ? "+" : ""
                }}{{ trendsData.item_trend.change_percentage }}%
              </p>
              <p class="text-sm">vs previous period</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- User Activity Chart -->
        <div class="card">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">
            User Activity (30 days)
          </h2>
          <LineChart
            v-if="userActivityChartData"
            :chart-data="userActivityChartData"
            :options="chartOptions"
          />
        </div>

        <!-- Item Sales Chart -->
        <div class="card">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">
            Item Sales (30 days)
          </h2>
          <LineChart
            v-if="itemSalesChartData"
            :chart-data="itemSalesChartData"
            :options="chartOptions"
          />
        </div>

        <!-- Category Distribution -->
        <div class="card">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">
            Items by Category
          </h2>
          <DoughnutChart
            v-if="categoryChartData"
            :chart-data="categoryChartData"
            :options="doughnutOptions"
          />
        </div>

        <!-- Page Views Chart -->
        <div class="card">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">
            Page Views (30 days)
          </h2>
          <BarChart
            v-if="pageViewsChartData"
            :chart-data="pageViewsChartData"
            :options="chartOptions"
          />
        </div>
      </div>

      <!-- Top Users Table -->
      <div v-if="trendsData?.top_users" class="card">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">
          Top Users by Items
        </h2>
        <table class="table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Name</th>
              <th>Email</th>
              <th>Items Count</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(user, index) in trendsData.top_users" :key="user.id">
              <td class="font-bold">{{ index + 1 }}</td>
              <td class="font-medium">{{ user.name }}</td>
              <td>{{ user.email }}</td>
              <td>
                <span
                  class="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-medium"
                >
                  {{ user.items_count }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { reportService } from "@/services/report.service";
import { useLoading } from "@/composables/useLoading";
import LineChart from "@/components/charts/LineChart.vue";
import BarChart from "@/components/charts/BarChart.vue";
import DoughnutChart from "@/components/charts/DoughnutChart.vue";
import type { ReportMetrics, TrendsData } from "@/types";

const { loading, error, withLoading } = useLoading();

const metricsData = ref<ReportMetrics | null>(null);
const trendsData = ref<TrendsData | null>(null);

onMounted(async () => {
  await withLoading(async () => {
    const [metrics, trends] = await Promise.all([
      reportService.getMetrics(30),
      reportService.getTrends(),
    ]);
    metricsData.value = metrics;
    trendsData.value = trends;
  });
});

// Chart Options
const chartOptions = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: {
      display: true,
      position: "top" as const,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: {
      display: true,
      position: "right" as const,
    },
  },
};

// User Activity Chart Data
const userActivityChartData = computed(() => {
  if (!metricsData.value?.user_activity) return null;

  const data = metricsData.value.user_activity;
  const labels = data.map((d) =>
    new Date(d.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
  );
  const newUsers = data.map((d) => d.data.new_users);
  const activeUsers = data.map((d) => d.data.active_users);

  return {
    labels,
    datasets: [
      {
        label: "New Users",
        data: newUsers,
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        tension: 0.4,
      },
      {
        label: "Active Users",
        data: activeUsers,
        borderColor: "rgb(16, 185, 129)",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        tension: 0.4,
      },
    ],
  };
});

// Item Sales Chart Data
const itemSalesChartData = computed(() => {
  if (!metricsData.value?.item_sales) return null;

  const data = metricsData.value.item_sales;
  const labels = data.map((d) =>
    new Date(d.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
  );
  const sales = data.map((d) => d.data.total_sales);
  const revenue = data.map((d) => d.data.total_revenue);

  return {
    labels,
    datasets: [
      {
        label: "Total Sales",
        data: sales,
        borderColor: "rgb(139, 92, 246)",
        backgroundColor: "rgba(139, 92, 246, 0.1)",
        tension: 0.4,
      },
      {
        label: "Revenue ($)",
        data: revenue,
        borderColor: "rgb(245, 158, 11)",
        backgroundColor: "rgba(245, 158, 11, 0.1)",
        tension: 0.4,
        yAxisID: "y1",
      },
    ],
  };
});

// Category Distribution Chart Data
const categoryChartData = computed(() => {
  if (!trendsData.value?.categories) return null;

  const categories = trendsData.value.categories;
  const labels = Object.keys(categories).map(
    (k) => k.charAt(0).toUpperCase() + k.slice(1),
  );
  const data = Object.values(categories);

  return {
    labels,
    datasets: [
      {
        data,
        backgroundColor: [
          "rgb(59, 130, 246)",
          "rgb(16, 185, 129)",
          "rgb(139, 92, 246)",
          "rgb(245, 158, 11)",
          "rgb(239, 68, 68)",
          "rgb(107, 114, 128)",
        ],
      },
    ],
  };
});

// Page Views Chart Data
const pageViewsChartData = computed(() => {
  if (!metricsData.value?.daily_metrics) return null;

  const data = metricsData.value.daily_metrics;
  const labels = data.map((d) =>
    new Date(d.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
  );
  const pageViews = data.map((d) => d.data.page_views);
  const uniqueVisitors = data.map((d) => d.data.unique_visitors);

  return {
    labels,
    datasets: [
      {
        label: "Page Views",
        data: pageViews,
        backgroundColor: "rgba(59, 130, 246, 0.8)",
      },
      {
        label: "Unique Visitors",
        data: uniqueVisitors,
        backgroundColor: "rgba(16, 185, 129, 0.8)",
      },
    ],
  };
});
</script>
