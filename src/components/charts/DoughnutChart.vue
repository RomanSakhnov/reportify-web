<template>
  <div class="chart-container">
    <canvas ref="chartRef"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import {
  Chart,
  DoughnutController,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import type { ChartData, ChartOptions } from 'chart.js'

// Register Chart.js components
Chart.register(
  DoughnutController,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

const props = defineProps<{
  chartData: ChartData<'doughnut'>
  options?: ChartOptions<'doughnut'>
}>()

const chartRef = ref<HTMLCanvasElement | null>(null)
let chartInstance: Chart<'doughnut'> | null = null

const createChart = () => {
  if (!chartRef.value) return

  chartInstance = new Chart(chartRef.value, {
    type: 'doughnut',
    data: props.chartData,
    options: props.options || {}
  })
}

const destroyChart = () => {
  if (chartInstance) {
    chartInstance.destroy()
    chartInstance = null
  }
}

onMounted(() => {
  createChart()
})

onUnmounted(() => {
  destroyChart()
})

watch(() => props.chartData, () => {
  destroyChart()
  createChart()
}, { deep: true })
</script>

<style scoped>
.chart-container {
  position: relative;
  height: 300px;
}
</style>
