<template>
  <div class="chart-container">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { Chart, PieController, ArcElement, Tooltip, Legend } from 'chart.js'
import { useTransactionsStore } from '../../store/transactions'
import { storeToRefs } from 'pinia'

Chart.register(PieController, ArcElement, Tooltip, Legend)

const chartCanvas = ref(null)
const store = useTransactionsStore()
const { expensesByCategory } = storeToRefs(store)

let chartInstance = null

const renderChart = () => {
  const labels = Object.keys(expensesByCategory.value)
  const data = Object.values(expensesByCategory.value)

  if (chartInstance) chartInstance.destroy()

  chartInstance = new Chart(chartCanvas.value, {
    type: 'pie',
    data: {
      labels,
      datasets: [
        {
          label: 'Gastos por categoría',
          data,
          backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
          hoverOffset: 10,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'bottom' },
        tooltip: { enabled: true },
      },
      animation: {
        duration: 1200,
        easing: 'easeOutQuart',
      },
    },
  })
}

onMounted(renderChart)
watch(expensesByCategory, renderChart)
</script>

<style scoped>
.chart-container {
  width: 100%;
  max-width: 400px;
  margin: auto;
  transition: transform 0.3s ease;
}

.chart-container:hover {
  transform: scale(1.03);
}
</style>
