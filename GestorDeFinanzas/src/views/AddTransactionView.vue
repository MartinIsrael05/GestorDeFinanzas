<template>
  <div class="add-transaction">
    <h1>Agregar Transacción</h1>

    <form @submit.prevent="addTransaction">
      <label>Tipo:</label>
      <select v-model="form.type" required>
        <option value="income">Ingreso</option>
        <option value="expense">Gasto</option>
      </select>

      <label>Categoría:</label>
      <select v-model="form.category" required>
        <option v-for="cat in settingsStore.categories" :key="cat" :value="cat">
          {{ cat }}
        </option>
      </select>

      <label>Monto:</label>
      <input type="number" v-model.number="form.amount" min="1" required />

      <label>Fecha:</label>
      <input type="date" v-model="form.date" required />

      <button type="submit">Agregar</button>
    </form>

    <p v-if="message" class="success">{{ message }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useTransactionsStore } from '../store/transactions'
import { useSettingsStore } from '../store/settings'

const transactionsStore = useTransactionsStore()
const settingsStore = useSettingsStore()

const form = ref({
  type: 'expense',
  category: '',
  amount: null,
  date: ''
})

const message = ref('')

function addTransaction() {
  transactionsStore.addTransaction({ ...form.value })
  message.value = 'Transacción agregada con éxito ✅'
  form.value = { type: 'expense', category: '', amount: null, date: '' }
  setTimeout(() => (message.value = ''), 2000)
}
</script>

<style scoped>
.add-transaction {
  padding: 20px;
  font-family: Arial, sans-serif;
}
form {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 400px;
}
label {
  font-weight: bold;
}
input, select, button {
  padding: 8px;
  font-size: 14px;
}
button {
  background-color: #0275d8;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
button:hover {
  background-color: #0256a1;
}
.success {
  margin-top: 10px;
  color: green;
}
</style>
