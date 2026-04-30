<template>
  <div>
    <h3 class="font-display text-lg font-semibold mb-5" style="color: var(--color-text);">Gastos por categoría</h3>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <p class="text-xs uppercase tracking-widest mb-3 text-center" style="color: var(--color-text-muted);">Gastos</p>
        <div class="chart-container">
          <canvas ref="expenseChart"></canvas>
        </div>
      </div>
      <div>
        <p class="text-xs uppercase tracking-widest mb-3 text-center" style="color: var(--color-text-muted);">Ingresos</p>
        <div class="chart-container">
          <canvas ref="incomeChart"></canvas>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { Chart, PieController, ArcElement, Tooltip, Legend } from 'chart.js'
import { useTransactionsStore } from '../../store/transactions'
import { storeToRefs } from 'pinia'

Chart.register(PieController, ArcElement, Tooltip, Legend)

const expenseChart = ref(null)
const incomeChart  = ref(null)

const props = defineProps({
  selectedMonth: { type: String, required: true }
})

const store = useTransactionsStore()
const { transactions } = storeToRefs(store)

let expenseChartInstance = null
let incomeChartInstance  = null

const COLORS_EXPENSE = ['#f43f5e','#fb923c','#fbbf24','#e879f9','#a78bfa','#f87171']
const COLORS_INCOME  = ['#10b981','#34d399','#6ee7b7','#059669','#047857','#a7f3d0']

const renderCharts = () => {
  const expBycat = {}
  const incBycat = {}

  transactions.value
    .filter(t => t.date.startsWith(props.selectedMonth))
    .forEach(t => {
      if (t.type === 'expense') expBycat[t.category] = (expBycat[t.category] || 0) + t.amount
      else                      incBycat[t.category] = (incBycat[t.category] || 0) + t.amount
    })

  if (expenseChartInstance) expenseChartInstance.destroy()
  if (incomeChartInstance)  incomeChartInstance.destroy()

  const chartDefaults = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: '#94a3b8', font: { family: 'DM Sans', size: 11 }, padding: 12, boxWidth: 10, borderRadius: 4 }
      }
    },
    animation: { duration: 700, easing: 'easeOutQuart' }
  }

  expenseChartInstance = new Chart(expenseChart.value, {
    type: 'pie',
    data: {
      labels: Object.keys(expBycat),
      datasets: [{ data: Object.values(expBycat), backgroundColor: COLORS_EXPENSE, hoverOffset: 8, borderWidth: 0 }]
    },
    options: chartDefaults
  })

  incomeChartInstance = new Chart(incomeChart.value, {
    type: 'pie',
    data: {
      labels: Object.keys(incBycat),
      datasets: [{ data: Object.values(incBycat), backgroundColor: COLORS_INCOME, hoverOffset: 8, borderWidth: 0 }]
    },
    options: chartDefaults
  })
}

onMounted(renderCharts)
watch([transactions, () => props.selectedMonth], renderCharts)
</script>

<style scoped>
.chart-container { width: 100%; display: flex; justify-content: center; }
canvas { width: 200px !important; height: 200px !important; max-width: 100%; }
</style>
