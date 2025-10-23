<template>
  <div class="transactions">
    <h1>Transacciones</h1>

    <ul v-if="transactionsStore.transactions.length">
      <li 
        v-for="t in transactionsStore.transactions" 
        :key="t.id"
        :class="t.type"
      >
        <span>{{ t.date }}</span>
        <span>{{ t.category }}</span>
        <span>{{ t.type === 'income' ? '+' : '-' }}{{ t.amount.toLocaleString('es-AR') }} {{ settingsStore.currency }}</span>
      </li>
    </ul>

    <p v-else>No hay transacciones registradas.</p>
  </div>
</template>

<script setup>
import { useTransactionsStore } from '../store/transactions'
import { useSettingsStore } from '../store/settings'

const transactionsStore = useTransactionsStore()
const settingsStore = useSettingsStore()
</script>

<style scoped>
.transactions {
  padding: 20px;
  font-family: Arial, sans-serif;
}

.transactions h1 {
  font-size: 24px;
  margin-bottom: 20px;
}

.transactions ul {
  list-style: none;
  padding: 0;
}

.transactions li {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  margin-bottom: 8px;
  border-radius: 6px;
  background-color: #f1f1f1;
}

.transactions li.income {
  border-left: 6px solid #5cb85c;
}

.transactions li.expense {
  border-left: 6px solid #d9534f;
}
</style>
