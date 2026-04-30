<template>
  <div class="flex flex-col gap-8">
    <!-- Selector de mes/año -->
    <div class="flex flex-col md:flex-row md:items-center md:gap-6 gap-2">
      <label for="month" class="font-semibold text-muted">Seleccionar mes:</label>
      <select id="month" v-model="selectedMonth" class="rounded-xl border border-muted px-4 py-2 focus:ring-2 focus:ring-primary/30 focus:border-primary bg-white text-muted transition-all">
        <option v-for="m in availableMonths" :key="m.value" :value="m.value">
          {{ m.label }}
        </option>
      </select>
    </div>

    <h2 class="text-2xl font-bold text-primary mb-2">Resumen General - {{ currentMonthLabel }}</h2>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Balance General -->
      <div class="bg-surface rounded-xl shadow-card p-6 flex flex-col gap-2 transition-all duration-300 hover:shadow-lg">
        <h3 class="font-semibold text-lg mb-2 text-muted">Balance General</h3>
        <div class="flex flex-col gap-2">
          <div class="flex justify-between items-center">
            <span>Ingresos</span>
            <p class="font-bold text-success">${{ totalIncome }}</p>
          </div>
          <div class="flex justify-between items-center">
            <span>Gastos</span>
            <p class="font-bold text-danger">${{ totalExpense }}</p>
          </div>
          <div class="flex justify-between items-center">
            <span>Balance Actual</span>
            <p :class="['font-bold', balance < 0 ? 'text-danger' : 'text-primary']">${{ balance }}</p>
          </div>
        </div>
      </div>

      <!-- Presupuesto -->
      <div class="bg-surface rounded-xl shadow-card p-6 flex flex-col gap-2 transition-all duration-300 hover:shadow-lg">
        <h3 class="font-semibold text-lg mb-2 text-muted">Presupuesto</h3>
        <p>Presupuesto total: <span class="font-bold">${{ monthlyBudget }}</span></p>
        <p>Restante: <span class="font-bold">${{ remainingBudget }}</span></p>
        <div class="w-full bg-muted/10 rounded-full h-4 mt-2 overflow-hidden">
          <div class="h-full transition-all duration-500" :class="budgetUsedPercent >= 80 ? 'bg-danger' : 'bg-primary'" :style="{ width: budgetUsedPercent + '%' }"></div>
        </div>
        <p class="text-right text-xs mt-1">{{ budgetUsedPercent.toFixed(0) }}% usado</p>
        <p v-if="budgetAlert" class="text-danger font-bold mt-2 animate-pulse">¡Has superado el 80% de tu presupuesto mensual!</p>
      </div>

      <!-- Últimas transacciones -->
      <div class="bg-surface rounded-xl shadow-card p-6 flex flex-col gap-2 transition-all duration-300 hover:shadow-lg">
        <h3 class="font-semibold text-lg mb-2 text-muted">Últimas transacciones</h3>
        <ul class="divide-y divide-muted/10">
          <li v-for="t in latestTransactions" :key="t.id" class="flex justify-between items-center py-2 text-sm">
            <span>{{ t.category }} - {{ t.description || 'Sin descripción' }}</span>
            <strong :class="t.type === 'income' ? 'text-success' : 'text-danger'">{{ t.type === 'income' ? '+' : '-' }}${{ t.amount }}</strong>
          </li>
        </ul>
        <div class="flex gap-2 mt-3">
          <RouterLink to="/transactions" class="flex-1 px-4 py-2 rounded-lg bg-muted/10 hover:bg-primary/10 text-primary font-semibold text-center transition-colors">Ver todas</RouterLink>
          <RouterLink to="/add" class="flex-1 px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-white font-semibold text-center transition-colors">Agregar transacción</RouterLink>
        </div>
      </div>
    </div>

    <!-- Charts y Proyección -->
    <section class="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
      <div class="lg:col-span-2 flex flex-col gap-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CategoryChart :selectedMonth="selectedMonth" />
          <MonthlyComparisonChart />
        </div>
      </div>
      <!-- Panel de proyección -->
      <div class="bg-surface rounded-xl shadow-card p-6 flex flex-col gap-2 transition-all duration-300 hover:shadow-lg">
        <h3 class="font-semibold text-lg mb-2 text-muted">Proyección para {{ nextMonthLabel }}</h3>
        <p class="text-xs text-muted mb-2">Basado en los 2 meses anteriores a <strong>{{ currentMonthLabel }}</strong></p>
        <div class="flex flex-col gap-2 mt-2">
          <div class="flex justify-between items-center">
            <span>Gasto estimado</span>
            <p class="font-bold text-danger">${{ projectedExpense }}</p>
          </div>
          <div class="flex justify-between items-center">
            <span>Ingreso estimado</span>
            <p class="font-bold text-success">${{ projectedIncome }}</p>
          </div>
          <div class="flex justify-between items-center">
            <span>Balance proyectado</span>
            <p :class="['font-bold', projectedBalance < 0 ? 'text-danger' : 'text-primary']">${{ projectedBalance }}</p>
          </div>
        </div>
        <p class="text-xs text-muted mt-2">Lógica de la Proyección: promedio de gastos/ingresos de los 2 meses previos.</p>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useTransactionsStore } from '../store/transactions'
import { useSettingsStore } from '../store/settings'
import { RouterLink } from 'vue-router'
import CategoryChart from '../components/charts/CategoryChart.vue'
import MonthlyComparisonChart from '../components/charts/MonthlyComparisonChart.vue'

const transactionsStore = useTransactionsStore()
const settingsStore = useSettingsStore()
const { transactions } = storeToRefs(transactionsStore)

// Etiquetas de meses reutilizables
const monthLabels = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
]

// Generar los meses disponibles (últimos 6 meses desde noviembre 2025)
const availableMonths = computed(() => {
  const months = []

  // Comenzar desde noviembre 2025 e ir 6 meses atrás
  for (let i = 0; i < 6; i++) {
    const month = 11 - i // 11, 10, 9, 8, 7, 6
    const label = monthLabels[month - 1]
    const value = `2025-${String(month).padStart(2, '0')}`
    months.push({ label: `${label} 2025`, value })
  }

  return months.reverse() // Mostrar de junio a noviembre
})

// Mes seleccionado (por defecto noviembre 2025)
const selectedMonth = ref('2025-11')

// Etiqueta del mes actual
const currentMonthLabel = computed(() => {
  const found = availableMonths.value.find(m => m.value === selectedMonth.value)
  return found ? found.label : ''
})

// Label del mes siguiente (por ejemplo, si selectedMonth = '2025-11' -> 'Diciembre 2025')
const nextMonthLabel = computed(() => {
  const [y, m] = selectedMonth.value.split('-').map(Number)
  const d = new Date(y, m - 1)
  d.setMonth(d.getMonth() + 1)
  const label = monthLabels[d.getMonth()]
  return `${label} ${d.getFullYear()}`
})

// Filtrar transacciones por mes seleccionado
const filteredTransactions = computed(() => {
  return transactions.value.filter(t => t.date.startsWith(selectedMonth.value))
})

// Totales (basados en el mes filtrado)
const totalIncome = computed(() =>
  filteredTransactions.value.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0)
)
const totalExpense = computed(() =>
  filteredTransactions.value.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0)
)
const balance = computed(() => totalIncome.value - totalExpense.value)

// Presupuesto (basado en gastos del mes)
const monthlyBudget = computed(() => settingsStore.monthlyBudget)
const remainingBudget = computed(() => monthlyBudget.value - totalExpense.value)
const budgetUsedPercent = computed(() =>
  Math.min((totalExpense.value / monthlyBudget.value) * 100, 100)
)
const budgetAlert = computed(() => budgetUsedPercent.value >= 80)

// Últimas transacciones (del mes filtrado)
const latestTransactions = computed(() =>
  filteredTransactions.value.slice(-5).reverse()
)

// Proyección para el siguiente mes basada en los 2 meses anteriores
// devuelve YYYY-MM restando `n` meses a un YYYY-MM dado
function getPrevMonthKey(baseYm, n) {
  const [y, m] = baseYm.split('-').map(Number)
  const date = new Date(y, m - 1)
  date.setMonth(date.getMonth() - n)
  const yy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  return `${yy}-${mm}`
}

const expenseForMonth = (monthKey) =>
  transactions.value
    .filter(t => t.date.startsWith(monthKey) && t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0)

const incomeForMonth = (monthKey) =>
  transactions.value
    .filter(t => t.date.startsWith(monthKey) && t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0)

const expensePrev1 = computed(() => expenseForMonth(getPrevMonthKey(selectedMonth.value, 1)))
const expensePrev2 = computed(() => expenseForMonth(getPrevMonthKey(selectedMonth.value, 2)))
const incomePrev1 = computed(() => incomeForMonth(getPrevMonthKey(selectedMonth.value, 1)))
const incomePrev2 = computed(() => incomeForMonth(getPrevMonthKey(selectedMonth.value, 2)))

// Proyección simple: promedio de los 2 meses anteriores
const projectedExpense = computed(() => Math.round((expensePrev1.value + expensePrev2.value) / 2))
const projectedIncome = computed(() => Math.round((incomePrev1.value + incomePrev2.value) / 2))
const projectedBalance = computed(() => projectedIncome.value - projectedExpense.value)
</script>

<style scoped>
/* Animación para alerta de presupuesto */
.animate-pulse {
  animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
</style>
