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
        <template v-for="group in groupedMonths" :key="group.month">
          <tr class="month-header">
            <td colspan="5">{{ group.label }}</td>
          </tr>
          <tr v-for="t in group.items" :key="t.id">
            <td :class="t.type">{{ t.type === 'income' ? 'Ingreso' : 'Gasto' }}</td>
            <td>{{ t.category }}</td>
            <td>${{ t.amount }}</td>
            <td>{{ t.description || '-' }}</td>
            <td>{{ t.date }}</td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useTransactionsStore } from '../store/transactions'
import { storeToRefs } from 'pinia'

const store = useTransactionsStore()
const { transactions } = storeToRefs(store)

// etiquetas de meses (local al componente)
const monthLabels = [
  'Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'
]

// Agrupar transacciones por mes (YYYY-MM), ordenar meses descendente y transacciones por fecha descendente
const groupedMonths = computed(() => {
  const groups = {}
  transactions.value.forEach(t => {
    const month = t.date ? t.date.slice(0,7) : 'unknown'
    if (!groups[month]) groups[month] = []
    groups[month].push(t)
  })

  // ordenar meses (más reciente primero, 11-2025)
  const months = Object.keys(groups).filter(m => m !== 'unknown').sort((a,b) => b.localeCompare(a))
  if (groups['unknown']) months.push('unknown')

  return months.map(m => {
    const [y, mm] = m.split('-').map(Number)
    const label = m === 'unknown' ? 'Sin fecha' : `${monthLabels[mm - 1]} ${y}`
    const items = groups[m].slice().sort((a,b) => b.date.localeCompare(a.date))
    return { month: m, label, items }
  })
})
</script>

<style scoped>
.transactions {
  width: 75em;
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
