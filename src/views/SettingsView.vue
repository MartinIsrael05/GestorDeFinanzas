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
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
          </svg>
        </div>
        <div>
          <h2 class="font-display text-xl font-semibold" style="color: var(--color-text);">Presupuesto mensual</h2>
          <p class="text-xs mt-0.5" style="color: var(--color-text-muted);">Define tu límite de gastos para el mes</p>
        </div>
      </div>

      <div class="separator"></div>

      <!-- Current budget display -->
      <div class="flex items-end justify-between mb-6 mt-2">
        <p class="text-xs uppercase tracking-widest" style="color: var(--color-text-muted);">Presupuesto actual</p>
        <p class="font-display text-2xl font-semibold" style="color: var(--color-gold);">
          ${{ settingsStore.monthlyBudget.toLocaleString('es-AR') }} <span class="text-sm font-sans font-normal" style="color: var(--color-text-muted);">{{ settingsStore.currency }}</span>
        </p>
      </div>

      <!-- Input -->
      <div class="mb-5">
        <label class="block text-xs font-semibold uppercase tracking-widest mb-2" style="color: var(--color-text-muted);">Nuevo presupuesto</label>
        <div class="relative">
          <span class="absolute left-4 top-1/2 -translate-y-1/2 font-mono font-semibold text-sm" style="color: var(--color-text-muted);">$</span>
          <input
            type="number"
            v-model.number="newBudget"
            class="settings-input w-full rounded-xl pl-8 pr-4 py-3 text-sm font-mono transition-all focus:outline-none"
            placeholder="Ej: 150000"
          />
        </div>
      </div>

      <button
        @click="updateBudget"
        class="w-full py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
        style="background: var(--color-gold); color: var(--color-bg); box-shadow: 0 4px 20px rgba(245,158,11,0.25);"
      >
        Actualizar presupuesto
      </button>

      <Transition name="slide-up">
        <div v-if="saved" class="mt-4 flex items-center gap-2 p-3 rounded-lg text-sm font-medium" style="background: var(--color-primary-dim); color: var(--color-primary);">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          Presupuesto actualizado correctamente
        </div>
      </Transition>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useSettingsStore } from '../store/settings'

const settingsStore = useSettingsStore()
const newBudget = ref(settingsStore.monthlyBudget)
const saved = ref(false)

function updateBudget() {
  settingsStore.updateBudget(newBudget.value)
  saved.value = true
  setTimeout(() => (saved.value = false), 3000)
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
.slide-up-leave-active { transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
.slide-up-enter-from,
.slide-up-leave-to     { opacity: 0; transform: translateY(8px); }
</style>
