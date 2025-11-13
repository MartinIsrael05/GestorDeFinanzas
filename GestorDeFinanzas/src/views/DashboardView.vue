<template>
  <div class="dashboard">
    <!-- 🔹 Selector de mes/año -->
    <div class="month-selector">
      <label for="month">Seleccionar mes:</label>
      <select id="month" v-model="selectedMonth">
        <option v-for="m in availableMonths" :key="m.value" :value="m.value">
          {{ m.label }}
        </option>
      </select>
    </div>

    <h2 class="dashboard-title">Resumen General - {{ currentMonthLabel }}</h2>

    <div class="dashboard-grid">
      <div class="card summary">
        <h3>Balance General</h3>
        <div class="summary-values">
          <div class="summary-item income">
            <span>Ingresos</span>
            <p>${{ totalIncome }}</p>
          </div>
          <div class="summary-item expense">
            <span>Gastos</span>
            <p>${{ totalExpense }}</p>
          </div>
          <div class="summary-item balance">
            <span>Balance Actual</span>
            <p :class="{ negative: balance < 0 }">${{ balance }}</p>
          </div>
        </div>
      </div>

      <!-- Tarjeta de presupuesto -->
      <div class="card budget">
        <h3>Presupuesto</h3>
        <p>Presupuesto total: ${{ monthlyBudget }}</p>
        <p>Restante: ${{ remainingBudget }}</p>

        <div class="progress-bar-container">
          <div class="progress-bar" :style="{ width: budgetUsedPercent + '%' }"
            :class="{ warning: budgetUsedPercent >= 80 }"></div>
        </div>
        <p class="progress-text">{{ budgetUsedPercent.toFixed(0) }}% usado</p>

        <p v-if="budgetAlert" class="alert">
           ¡Has superado el 80% de tu presupuesto mensual!
        </p>
      </div>

      <!-- Últimas transacciones -->
      <div class="card transactions">
        <h3>Últimas transacciones</h3>
        <ul>
          <li v-for="t in latestTransactions" :key="t.id" :class="t.type">
            <span>{{ t.category }} - {{ t.description || 'Sin descripción' }}</span>
            <strong>{{ t.type === 'income' ? '+' : '-' }}${{ t.amount }}</strong>
          </li>
        </ul>
        <div class="buttons">
          <RouterLink to="/transactions" class="btn">Ver todas</RouterLink>
          <RouterLink to="/add" class="btn primary">Agregar transacción</RouterLink>
        </div>
      </div>
    </div>
    <section class="charts-section">
      <div class="charts-grid">
        <CategoryChart :selectedMonth="selectedMonth" />
        <MonthlyComparisonChart />
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

// Generar meses disponibles (últimos 6 meses desde noviembre 2025)
const availableMonths = computed(() => {
  const months = []
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
  'Diciembre'
]
  
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
</script>

<style scoped>
.month-selector {
  margin-bottom: 20px;
  align-items: center;
  gap: 10px;
}

.month-selector label {
  font-weight: 600;
  color: #333;
}

.month-selector select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1em;
  cursor: pointer;
  background-color: white;
  color: #333;
}

.month-selector select:hover {
  border-color: #0275d8;
}

.month-selector select:focus {
  outline: none;
  border-color: #0275d8;
  box-shadow: 0 0 0 3px rgba(2, 117, 216, 0.1);
}

.dashboard {
  display: flex;
  gap: 25px;
  padding: 20px;
}

.dashboard-title {
  color: #0275d8;
  margin-bottom: 10px;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 20px;
  align-items: stretch;
}

/* --- Tarjetas --- */
.card {
  background-color: #fff;
  border-radius: 14px;
  padding: 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.card h3 {
  margin-bottom: 15px;
  color: #333;
}

/* --- Balance general --- */
.summary-values {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.summary-item {
  display: flex;
  justify-content: space-between;
}

.summary-item p {
  font-weight: bold;
}

.income p {
  color: #28a745;
}

.expense p {
  color: #dc3545;
}

.balance p {
  color: #333;
}

.balance p.negative {
  color: #d9534f;
}

/* --- Presupuesto --- */
.progress-bar-container {
  background-color: #eee;
  border-radius: 10px;
  height: 15px;
  overflow: hidden;
  margin-top: 8px;
}

.progress-bar {
  height: 100%;
  background-color: #0275d8;
  transition: width 0.4s ease;
}

.progress-bar.warning {
  background-color: #d9534f;
}

.progress-text {
  text-align: right;
  margin-top: 5px;
  font-size: 0.9em;
  color: #555;
}

.alert {
  color: #d9534f;
  font-weight: bold;
  margin-top: 10px;
}

/* --- Últimas transacciones --- */
.transactions ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.transactions li {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.transactions li.income strong {
  color: #28a745;
}

.transactions li.expense strong {
  color: #dc3545;
}

.buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
}

.btn {
  padding: 8px 14px;
  border-radius: 8px;
  background-color: #eee;
  text-decoration: none;
  color: #333;
  font-weight: 600;
}

.btn.primary {
  background-color: #0275d8;
  color: white;
}

.btn:hover {
  opacity: 0.9;
}
/* charts */
.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}
.chart-container {
  width: 100%;
  max-width: 600px;
  margin: auto;
  transition: transform 0.3s ease;
}
.chart-container:hover {
  transform: scale(1.03);
}

</style>
