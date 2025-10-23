<template>
  <div class="p-6 space-y-4">
    <h1 class="text-2xl font-bold">Dashboard</h1>

    <!-- Alerta de presupuesto -->
    <Alert :message="transactionsStore.budgetAlert" />

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card title="Ingresos" :value="transactionsStore.totalIncome" color="green" />
      <Card title="Gastos" :value="transactionsStore.totalExpenses" color="red" />
      <Card title="Balance" :value="transactionsStore.balance" color="blue" />
    </div>
  </div>
</template>

<script setup>
import { useTransactionsStore } from '../store/transactions'
import Alert from '../components/ui/Alert.vue'
import Card from '../components/ui/Card.vue'

const transactionsStore = useTransactionsStore()
</script>
