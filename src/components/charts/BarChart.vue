<template>
  <div class="chart-container">
    <canvas ref="chartRef"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from "vue";
import {
  Chart,
  BarController,
  BarElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import type { ChartData, ChartOptions } from "chart.js";

// Register Chart.js components
Chart.register(
  BarController,
  BarElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
);

const props = defineProps<{
  chartData: ChartData<"bar">;
  options?: ChartOptions<"bar">;
}>();

const chartRef = ref<HTMLCanvasElement | null>(null);
let chartInstance: Chart<"bar"> | null = null;

const createChart = () => {
  if (!chartRef.value) return;

  chartInstance = new Chart(chartRef.value, {
    type: "bar",
    data: props.chartData,
    options: props.options || {},
  });
};

const destroyChart = () => {
  if (chartInstance) {
    chartInstance.destroy();
    chartInstance = null;
  }
};

onMounted(() => {
  createChart();
});

onUnmounted(() => {
  destroyChart();
});

watch(
  () => props.chartData,
  () => {
    destroyChart();
    createChart();
  },
  { deep: true },
);
</script>

<style scoped>
.chart-container {
  position: relative;
  height: 300px;
}
</style>
