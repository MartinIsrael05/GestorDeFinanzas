<template>
  <div class="charts-wrapper">
    <!-- Gráfico de Gastos -->
    <div class="chart-section">
      <h3>Gastos por Categoría</h3>
      <div class="chart-container">
        <canvas ref="expenseChart"></canvas>
      </div>
    </div>

    <!-- Gráfico de Ingresos -->
    <div class="chart-section">
      <h3>Ingresos por Categoría</h3>
      <div class="chart-container">
        <canvas ref="incomeChart"></canvas>
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
const incomeChart = ref(null)

// Recibir el mes seleccionado como prop
const props = defineProps({
  selectedMonth: {
    type: String,
    required: true,
  },
})

const store = useTransactionsStore()
const { transactions } = storeToRefs(store)

let expenseChartInstance = null
let incomeChartInstance = null

// Filtrar transacciones según el mes seleccionado
const getFilteredTransactions = () => {
  return transactions.value.filter(t => t.date.startsWith(props.selectedMonth))
}

// Crea los dos gráficos
const renderCharts = () => {
  const expensesByCategory = {}
  const incomeByCategory = {}

  // Clasifica las transacciones filtradas por categoría y tipo
  getFilteredTransactions().forEach(t => {
    if (t.type === 'expense') {
      expensesByCategory[t.category] = (expensesByCategory[t.category] || 0) + t.amount
    } else if (t.type === 'income') {
      incomeByCategory[t.category] = (incomeByCategory[t.category] || 0) + t.amount
    }
  })

  // Destruye los gráficos previos si existen
  if (expenseChartInstance) expenseChartInstance.destroy()
  if (incomeChartInstance) incomeChartInstance.destroy()

  // Gráfico de gastos
  expenseChartInstance = new Chart(expenseChart.value, {
    type: 'pie',
    data: {
      labels: Object.keys(expensesByCategory),
      datasets: [
        {
          label: 'Gastos por categoría',
          data: Object.values(expensesByCategory),
          backgroundColor: ['#FF6384', '#FF9F40', '#FFCE56', '#4BC0C0', '#9966FF', '#36A2EB'],
          hoverOffset: 10,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'bottom' },
      },
      animation: {
        duration: 1000,
        easing: 'easeOutQuart',
      },
    },
  })

  // Gráfico de ingresos
  incomeChartInstance = new Chart(incomeChart.value, {
    type: 'pie',
    data: {
      labels: Object.keys(incomeByCategory),
      datasets: [
        {
          label: 'Ingresos por categoría',
          data: Object.values(incomeByCategory),
          backgroundColor: ['#4BC0C0', '#36A2EB', '#9966FF', '#FF9F40', '#FFCE56', '#FF6384'],
          hoverOffset: 10,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'bottom' },
      },
      animation: {
        duration: 1000,
        easing: 'easeOutQuart',
      },
    },
  })
}

onMounted(renderCharts)
watch([transactions, () => props.selectedMonth], renderCharts)
</script>

<style scoped>
.charts-wrapper {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 30px;
}

.chart-section {
  text-align: center;
  flex: 1;
  min-width: 320px;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease;
}

.chart-section:hover {
  transform: scale(1.02);
}

h3 {
  color: #0275d8;
  margin-bottom: 15px;
  font-size: 1.1rem;
}

.chart-container {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
canvas {
  width: 280px !important;
  height: 280px !important;
  max-width: 100%;
}
</style>


