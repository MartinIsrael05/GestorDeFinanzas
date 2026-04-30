<template>
  <div class="chart-container">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { Chart, BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js'
import { useTransactionsStore } from '../../store/transactions'
import { storeToRefs } from 'pinia'

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend)

const chartCanvas = ref(null)
const store = useTransactionsStore()
const { monthlySummary } = storeToRefs(store)

let chartInstance = null

const renderChart = () => {
  const months = Object.keys(monthlySummary.value)
  const incomeData = months.map(m => monthlySummary.value[m].income)
  const expenseData = months.map(m => monthlySummary.value[m].expense)

  if (chartInstance) chartInstance.destroy()

  chartInstance = new Chart(chartCanvas.value, {
    type: 'bar',
    data: {
      labels: months,
      datasets: [
        {
          label: 'Ingresos',
          data: incomeData,
          backgroundColor: '#4CAF50',
          borderRadius: 6,
        },
        {
          label: 'Gastos',
          data: expenseData,
          backgroundColor: '#F44336',
          borderRadius: 6,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'bottom' },
        tooltip: { enabled: true },
      },
      scales: {
        y: { beginAtZero: true, grid: { color: '#eee' } },
        x: { grid: { display: false } },
      },
      animation: {
        duration: 1500,
        easing: 'easeOutQuart',
      },
    },
  })
}

onMounted(renderChart)
watch(monthlySummary, renderChart)
</script>

<style scoped>
.chart-container {
  width: 100%;
  max-width: 600px;
  margin: auto;
  transition: transform 0.3s ease;
}

.chart-container:hover {
  transform: scale(1.02);
}
</style>
