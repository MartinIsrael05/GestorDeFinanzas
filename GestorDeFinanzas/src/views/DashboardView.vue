<template>
  <div class="dashboard">
    <h2>Resumen General</h2>

    <div class="cards">
      <div class="card income">
        <h3>Ingresos</h3>
        <p>${{ totalIncome }}</p>
      </div>

      <div class="card expense">
        <h3>Gastos</h3>
        <p>${{ totalExpenses }}</p>
      </div>

      <div class="card balance">
        <h3>Balance Actual</h3>
        <p>${{ balance }}</p>
      </div>
    </div>

    <div class="budget-section">
      <h3>Presupuesto</h3>
      <p>
        Presupuesto total: <strong>${{ monthlyBudget }}</strong><br />
        Presupuesto restante:
        <strong
          :class="{ warning: remainingBudget < monthlyBudget * 0.2 }"
        >
          ${{ remainingBudget }}
        </strong>
      </p>

      <div class="progress-bar">
        <div
          class="progress-fill"
          :style="{
            width: progressPercentage + '%',
            backgroundColor: progressColor
          }"
        >
          <span
            class="progress-text"
            :style="{ color: textColor }"
          >
            {{ progressPercentage.toFixed(0) }}%
          </span>
        </div>
      </div>

      <p v-if="alertBudget" class="alert">
        ⚠️ ¡Has superado el 80% de tu presupuesto mensual!
      </p>
    </div>
  </div>
</template>

<script setup>
import { useTransactionsStore } from '../store/transactions'
import { useSettingsStore } from '../store/settings'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

const transactionsStore = useTransactionsStore()
const settingsStore = useSettingsStore()

const { transactions } = storeToRefs(transactionsStore)
const { monthlyBudget } = storeToRefs(settingsStore)

// Totales
const totalIncome = computed(() =>
  transactions.value
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0)
)

const totalExpenses = computed(() =>
  transactions.value
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0)
)

const balance = computed(() => totalIncome.value - totalExpenses.value)

// Presupuesto restante
const remainingBudget = computed(() => {
  const remaining = monthlyBudget.value - totalExpenses.value
  return remaining >= 0 ? remaining : 0
})

// Porcentaje del presupuesto utilizado
const progressPercentage = computed(() => {
  if (monthlyBudget.value === 0) return 0
  const percentage = (totalExpenses.value / monthlyBudget.value) * 100
  return percentage > 100 ? 100 : percentage
})

// Color dinámico de la barra
const progressColor = computed(() => {
  const p = progressPercentage.value
  if (p <= 50) return '#28a745' // verde
  if (p <= 80) return '#ffc107' // amarillo
  return '#dc3545' // rojo
})

// Texto legible según color de fondo
const textColor = computed(() => {
  const p = progressPercentage.value
  return p <= 50 ? 'black' : 'white'
})

// Alerta cuando se supera el 80%
const alertBudget = computed(() => {
  return totalExpenses.value >= monthlyBudget.value * 0.8
})
</script>

<style scoped>
.dashboard {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
}

.cards {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  margin-top: 20px;
  gap: 15px;
}

.card {
  flex: 1;
  min-width: 150px;
  background-color: #f6f7fb;
  padding: 20px;
  border-radius: 10px;
}

.card h3 {
  margin-bottom: 5px;
}

.income p {
  color: green;
  font-weight: bold;
}

.expense p {
  color: red;
  font-weight: bold;
}

.balance p {
  color: #333;
  font-weight: bold;
}

/* Sección de presupuesto */
.budget-section {
  margin-top: 30px;
  text-align: center;
}

.budget-section h3 {
  color: #0275d8;
  margin-bottom: 10px;
}

.progress-bar {
  width: 100%;
  height: 30px;
  background-color: #e6e6e6;
  border-radius: 10px;
  overflow: hidden;
  margin: 15px 0;
  position: relative;
}

.progress-fill {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: width 0.5s ease, background-color 0.5s ease;
}

.progress-text {
  font-weight: bold;
  font-size: 14px;
}

.warning {
  color: #d9534f;
}

.alert {
  color: #d9534f;
  font-weight: bold;
  margin-top: 15px;
}
</style>
