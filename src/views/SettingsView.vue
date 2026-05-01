<template>
  <div class="flex flex-col gap-8 animate-fade-up max-w-xl mx-auto">

    <!-- Header -->
    <div>
      <p class="text-sm font-medium mb-1 uppercase tracking-widest" style="color: var(--color-primary);">Ajustes</p>
      <h1 class="font-display text-4xl font-semibold" style="color: var(--color-text);">Configuración</h1>
    </div>

    <!-- Budget Card -->
    <div class="card-glass p-8">
      <div class="flex items-center gap-3 mb-6">
        <div class="w-10 h-10 rounded-xl flex items-center justify-center" style="background: var(--color-gold-dim);">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="1" x2="12" y2="23" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        </div>
        <div>
          <h2 class="font-display text-xl font-semibold" style="color: var(--color-text);">Presupuesto mensual</h2>
          <p class="text-xs mt-0.5" style="color: var(--color-text-muted);">Define tu límite de gastos para el mes</p>
        </div>
      </div>

      <div class="separator"></div>

      <!-- Current budget + live usage -->
      <div class="mt-4 mb-6 p-4 rounded-xl"
        style="background: var(--color-surface-el); border: 1px solid var(--color-border);">
        <div class="flex items-end justify-between mb-3">
          <p class="text-xs uppercase tracking-widest" style="color: var(--color-text-muted);">Presupuesto actual</p>
          <p class="font-display text-2xl font-semibold" style="color: var(--color-gold);">
            ${{ settingsStore.monthlyBudget.toLocaleString('es-AR') }}
            <span class="text-sm font-sans font-normal" style="color: var(--color-text-muted);">{{
              settingsStore.currency }}</span>
          </p>
        </div>

        <!-- Barra de uso en tiempo real -->
        <div class="flex items-center justify-between text-xs mb-1.5" style="color: var(--color-text-muted);">
          <span>Gastos este mes</span>
          <span
            :style="{ color: usagePercent >= 100 ? 'var(--color-danger)' : usagePercent >= 80 ? '#f59e0b' : 'var(--color-text-sub)' }">
            {{ usagePercent.toFixed(0) }}% usado
          </span>
        </div>
        <div class="w-full h-2 rounded-full overflow-hidden" style="background: var(--color-border);">
          <div class="h-full rounded-full transition-all duration-500" :style="{
            width: Math.min(usagePercent, 100) + '%',
            background: usagePercent >= 100
              ? 'var(--color-danger)'
              : usagePercent >= 80
                ? '#f59e0b'
                : 'var(--color-primary)'
          }"></div>
        </div>
        <div class="flex justify-between text-xs mt-2">
          <span style="color: var(--color-text-muted);">
            Gastado: <strong style="color: var(--color-text-sub);">${{ currentMonthExpenses.toLocaleString('es-AR')
              }}</strong>
          </span>
          <span :style="{ color: remainingBudget < 0 ? 'var(--color-danger)' : 'var(--color-primary)' }">
            {{ remainingBudget < 0 ? 'Excedido' : 'Disponible' }}: <strong>${{
              Math.abs(remainingBudget).toLocaleString('es-AR') }}</strong>
          </span>
        </div>
      </div>

      <!-- Input nuevo presupuesto -->
      <div class="mb-5">
        <label class="block text-xs font-semibold uppercase tracking-widest mb-2"
          style="color: var(--color-text-muted);">Nuevo presupuesto</label>
        <div class="relative">
          <span class="absolute left-4 top-1/2 -translate-y-1/2 font-mono font-semibold text-sm"
            style="color: var(--color-text-muted);">$</span>
          <input type="number" v-model.number="newBudget" @keyup.enter="handleUpdate"
            class="settings-input w-full rounded-xl pl-8 pr-4 py-3 text-sm font-mono transition-all focus:outline-none"
            placeholder="Ej: 500000" min="1" />
        </div>

        <!-- Preview en tiempo real mientras escribe -->
        <div v-if="newBudget && newBudget !== settingsStore.monthlyBudget" class="mt-2 text-xs"
          style="color: var(--color-text-muted);">
          Con este presupuesto:
          <span
            :style="{ color: previewUsage >= 100 ? 'var(--color-danger)' : previewUsage >= 80 ? '#f59e0b' : 'var(--color-primary)' }">
            {{ previewUsage.toFixed(0) }}% ya usado
          </span>
          —
          <span :style="{ color: previewRemaining < 0 ? 'var(--color-danger)' : 'var(--color-primary)' }">
            {{ previewRemaining < 0 ? 'excede por' : 'disponible' }} ${{
              Math.abs(previewRemaining).toLocaleString('es-AR') }} </span>
        </div>
      </div>

      <button @click="handleUpdate"
        :disabled="!newBudget || newBudget <= 0 || newBudget === settingsStore.monthlyBudget"
        class="w-full py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:opacity-90 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
        style="background: var(--color-gold); color: var(--color-bg); box-shadow: 0 4px 20px rgba(245,158,11,0.25);">
        Actualizar presupuesto
      </button>

      <!-- Feedback de éxito -->
      <Transition name="slide-up">
        <div v-if="saved" class="mt-4 flex items-center gap-2 p-3 rounded-lg text-sm font-medium"
          style="background: var(--color-primary-dim); color: var(--color-primary);">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Presupuesto actualizado — todo el balance se recalculó automáticamente
        </div>
      </Transition>

      <!-- Feedback de error -->
      <Transition name="slide-up">
        <div v-if="error" class="mt-4 flex items-center gap-2 p-3 rounded-lg text-sm font-medium"
          style="background: rgba(239,68,68,0.1); color: var(--color-danger);">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {{ error }}
        </div>
      </Transition>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useSettingsStore } from '../store/settings'
import { useTransactionsStore } from '../store/transactions'

const settingsStore = useSettingsStore()
const transactionsStore = useTransactionsStore()

const newBudget = ref(settingsStore.monthlyBudget)
const saved = ref(false)
const error = ref('')

// Gastos del mes actual
const currentMonthExpenses = computed(() => {
  const now = new Date()
  const key = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  return transactionsStore.transactions
    .filter(t => t.type === 'expense' && t.date.startsWith(key))
    .reduce((acc, t) => acc + t.amount, 0)
})

const remainingBudget = computed(() => settingsStore.monthlyBudget - currentMonthExpenses.value)
const usagePercent = computed(() => (currentMonthExpenses.value / settingsStore.monthlyBudget) * 100)

// Preview en tiempo real con el valor que está escribiendo
const previewUsage = computed(() => newBudget.value > 0 ? (currentMonthExpenses.value / newBudget.value) * 100 : 0)
const previewRemaining = computed(() => (newBudget.value || 0) - currentMonthExpenses.value)

function handleUpdate() {
  error.value = ''
  if (!newBudget.value || newBudget.value <= 0) {
    error.value = 'El presupuesto debe ser mayor a cero.'
    setTimeout(() => (error.value = ''), 3000)
    return
  }
  const ok = settingsStore.updateBudget(newBudget.value)
  if (ok) {
    saved.value = true
    setTimeout(() => (saved.value = false), 3000)
  }
}
</script>

<style scoped>
.settings-input {
  background: var(--color-surface-el);
  border: 1px solid var(--color-border);
  color: var(--color-text);
}

.settings-input:focus {
  border-color: var(--color-gold);
  box-shadow: 0 0 0 3px var(--color-gold-dim);
}

.settings-input::placeholder {
  color: var(--color-text-muted);
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>