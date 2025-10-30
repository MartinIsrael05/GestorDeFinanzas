<template>
  <div class="transactions">
    <h2>Transacciones</h2>

    <div v-if="transactions.length === 0" class="empty">
      <p>No hay transacciones registradas todavía.</p>
    </div>

    <table v-else>
      <thead>
        <tr>
          <th>Tipo</th>
          <th>Categoría</th>
          <th>Monto</th>
          <th>Descripción</th>
          <th>Fecha</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(t, i) in transactions" :key="i">
          <td :class="t.type">{{ t.type === 'income' ? 'Ingreso' : 'Gasto' }}</td>
          <td>{{ t.category }}</td>
          <td>${{ t.amount }}</td>
          <td>{{ t.description || '-' }}</td>
          <td>{{ t.date }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { useTransactionsStore } from '../store/transactions'
import { storeToRefs } from 'pinia'

const store = useTransactionsStore()
const { transactions } = storeToRefs(store)
</script>

<style scoped>
.transactions {
  max-width: 800px;
  margin: 0 auto;
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  color: #0275d8;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

th,
td {
  border-bottom: 1px solid #ddd;
  padding: 10px;
  text-align: left;
}

th {
  background-color: #f1f1f1;
}

.income {
  color: green;
  font-weight: bold;
}

.expense {
  color: red;
  font-weight: bold;
}

.empty {
  text-align: center;
  color: #666;
  padding: 30px 0;
}
</style>
