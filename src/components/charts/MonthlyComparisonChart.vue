<template>
  <div>
    <h3 class="font-display text-lg font-semibold mb-5" style="color: var(--color-text);">Comparación mensual</h3>
    <div class="chart-container">
      <canvas ref="chartCanvas"></canvas>
    </div>
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
  const months      = Object.keys(monthlySummary.value)
  const incomeData  = months.map(m => monthlySummary.value[m].income)
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
          backgroundColor: 'rgba(16,185,129,0.8)',
          borderRadius: 6,
          borderSkipped: false,
        },
        {
          label: 'Gastos',
          data: expenseData,
          backgroundColor: 'rgba(244,63,94,0.8)',
          borderRadius: 6,
          borderSkipped: false,
        },
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: '#94a3b8',
            font: { family: 'DM Sans', size: 11 },
            padding: 16,
            boxWidth: 12,
            borderRadius: 4,
          }
        },
        tooltip: { enabled: true }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid:  { color: 'rgba(42,49,70,0.8)' },
          ticks: { color: '#64748b', font: { family: 'JetBrains Mono', size: 10 } }
        },
        x: {
          grid:  { display: false },
          ticks: { color: '#64748b', font: { family: 'DM Sans', size: 11 } }
        }
      },
      animation: { duration: 800, easing: 'easeOutQuart' }
    }
  })
}

onMounted(renderChart)
watch(monthlySummary, renderChart)
</script>

<style scoped>
.chart-container {
  width: 100%;
  max-width: 100%;
}
</style>
