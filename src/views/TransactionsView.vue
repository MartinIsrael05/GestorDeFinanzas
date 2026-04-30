<template>
  <div class="flex flex-col gap-8 animate-fade-up">

    <!-- Header -->
    <div>
      <p class="text-sm font-medium mb-1 uppercase tracking-widest" style="color: var(--color-primary);">Historial</p>
      <h1 class="font-display text-4xl font-semibold" style="color: var(--color-text);">Transacciones</h1>
    </div>

    <!-- Empty state -->
    <div v-if="transactions.length === 0" class="card-glass p-16 flex flex-col items-center gap-4 text-center">
      <div class="w-16 h-16 rounded-2xl flex items-center justify-center mb-2" style="background: var(--color-surface-el);">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" stroke-width="1.5"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
      </div>
      <p class="text-lg font-display font-medium" style="color: var(--color-text-sub);">Sin transacciones registradas</p>
      <p class="text-sm" style="color: var(--color-text-muted);">Empezá a registrar tus ingresos y gastos</p>
      <RouterLink to="/add" class="mt-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all hover:opacity-90" style="background: var(--color-primary); color: #fff;">
        Agregar primera transacción
      </RouterLink>
    </div>

    <!-- Transactions grouped by month -->
    <div v-else class="flex flex-col gap-8">
      <div v-for="group in groupedMonths" :key="group.month">
        <!-- Month label -->
        <div class="flex items-center gap-4 mb-4">
          <h2 class="font-display text-xl font-semibold" style="color: var(--color-text);">{{ group.label }}</h2>
          <div class="flex-1 h-px" style="background: var(--color-border);"></div>
          <span class="text-xs font-medium px-3 py-1 rounded-full" style="background: var(--color-surface-el); color: var(--color-text-muted);">
            {{ group.items.length }} mov.
          </span>
        </div>

        <!-- Table -->
        <div class="card-glass overflow-hidden">
          <table class="w-full text-sm">
            <thead>
              <tr style="border-bottom: 1px solid var(--color-border); background: var(--color-surface-el);">
                <th class="text-left px-5 py-3 text-xs font-semibold uppercase tracking-widest" style="color: var(--color-text-muted);">Tipo</th>
                <th class="text-left px-5 py-3 text-xs font-semibold uppercase tracking-widest" style="color: var(--color-text-muted);">Categoría</th>
                <th class="text-left px-5 py-3 text-xs font-semibold uppercase tracking-widest" style="color: var(--color-text-muted);">Descripción</th>
                <th class="text-right px-5 py-3 text-xs font-semibold uppercase tracking-widest" style="color: var(--color-text-muted);">Monto</th>
                <th class="text-right px-5 py-3 text-xs font-semibold uppercase tracking-widest" style="color: var(--color-text-muted);">Fecha</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="t in group.items"
                :key="t.id"
                class="transaction-row"
                style="border-bottom: 1px solid var(--color-border);"
              >
                <td class="px-5 py-3.5">
                  <span class="badge" :class="t.type === 'income' ? 'badge-income' : 'badge-expense'">
                    {{ t.type === 'income' ? '↑ Ingreso' : '↓ Gasto' }}
                  </span>
                </td>
                <td class="px-5 py-3.5 font-medium" style="color: var(--color-text);">{{ t.category }}</td>
                <td class="px-5 py-3.5" style="color: var(--color-text-muted);">{{ t.description || '—' }}</td>
                <td class="px-5 py-3.5 text-right font-mono font-semibold" :style="{ color: t.type === 'income' ? 'var(--color-primary)' : 'var(--color-danger)' }">
                  {{ t.type === 'income' ? '+' : '-' }}${{ t.amount.toLocaleString('es-AR') }}
                </td>
                <td class="px-5 py-3.5 text-right font-mono text-xs" style="color: var(--color-text-muted);">{{ t.date }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useTransactionsStore } from '../store/transactions'
import { storeToRefs } from 'pinia'
import { RouterLink } from 'vue-router'

const store = useTransactionsStore()
const { transactions } = storeToRefs(store)

const monthLabels = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']

const groupedMonths = computed(() => {
  const groups = {}
  transactions.value.forEach(t => {
    const month = t.date ? t.date.slice(0,7) : 'unknown'
    if (!groups[month]) groups[month] = []
    groups[month].push(t)
  })
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
.transaction-row {
  transition: background var(--transition);
}
.transaction-row:hover {
  background: rgba(255,255,255,0.02);
}
.transaction-row:last-child {
  border-bottom: none;
}
</style>
