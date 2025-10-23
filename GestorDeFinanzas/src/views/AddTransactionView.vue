<template>
  <div class="add-transaction">
    <h2>Agregar Transacción</h2>

    <form @submit.prevent="addTransaction">
      <!-- Tipo -->
      <div class="form-group">
        <label for="type">Tipo</label>
        <select v-model="form.type" id="type">
          <option value="ingreso">Ingreso</option>
          <option value="gasto">Gasto</option>
        </select>
      </div>

      <!-- Categoría -->
      <div class="form-group">
        <label for="category">Categoría</label>
        <select id="category" v-model="form.category" required>
          <option v-for="cat in availableCategories" :key="cat" :value="cat">
            {{ cat }}
          </option>
        </select>
      </div>

      <!-- Monto -->
      <div class="form-group">
        <label for="amount">Monto</label>
        <input
          type="number"
          id="amount"
          v-model.number="form.amount"
          min="0"
          required
        />
      </div>

      <!-- Descripción -->
      <div class="form-group">
        <label for="description">Descripción de la transacción</label>
        <input
          type="text"
          id="description"
          v-model="form.description"
          placeholder="Ej: Pago de luz, regalo de cumpleaños..."
        />
      </div>

      <button type="submit">Agregar</button>
    </form>

    <!-- Mensaje temporal -->
    <p v-if="message" class="success">{{ message }}</p>
  </div>
</template>

<script setup>
import { reactive, computed, ref } from 'vue'
import { useTransactionsStore } from '../store/transactions'

// Store
const transactionsStore = useTransactionsStore()

// Formulario reactivo
const form = reactive({
  type: 'gasto',
  category: '',
  amount: null,
  description: '',
})

// Mensaje temporal
const message = ref('')

// Categorías por tipo
const incomeCategories = ['Sueldo', 'Venta', 'Regalo', 'Otros ingresos']
const expenseCategories = [
  'Comida',
  'Transporte',
  'Entretenimiento',
  'Servicios',
  'Otros gastos',
]

// Computed que devuelve las categorías según el tipo elegido
const availableCategories = computed(() =>
  form.type === 'ingreso' ? incomeCategories : expenseCategories
)

// Función para agregar la transacción al store
function addTransaction() {
  if (!form.category || !form.amount) return

  // Mapear tipo a 'income' o 'expense' para el store
  const type = form.type === 'ingreso' ? 'income' : 'expense'

  transactionsStore.addTransaction({
    type,
    category: form.category,
    amount: form.amount,
    description: form.description,
    date: new Date().toISOString().split('T')[0], // fecha actual
  })

  // Mensaje temporal
  message.value = 'Transacción agregada ✅'
  setTimeout(() => (message.value = ''), 2000)

  // Reset del formulario
  form.category = ''
  form.amount = null
  form.description = ''
}
</script>

<style scoped>
.add-transaction {
  max-width: 400px;
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

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
}

input,
select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 14px;
}

button {
  width: 100%;
  background-color: #0275d8;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
}

button:hover {
  background-color: #0256a3;
}

.success {
  margin-top: 10px;
  color: green;
  font-weight: bold;
  text-align: center;
}
</style>
