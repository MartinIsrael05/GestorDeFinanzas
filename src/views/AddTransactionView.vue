<template>
  <div class="flex flex-col gap-8 animate-fade-up max-w-xl mx-auto">

    <!-- Header -->
    <div>
      <p class="text-sm font-medium mb-1 uppercase tracking-widest" style="color: var(--color-primary);">Registro</p>
      <h1 class="font-display text-4xl font-semibold" style="color: var(--color-text);">Nueva transacción</h1>
    </div>

    <!-- Form Card -->
    <div class="card-glass p-8">

      <!-- Type Toggle -->
      <div class="mb-7">
        <label class="block text-xs font-semibold uppercase tracking-widest mb-3" style="color: var(--color-text-muted);">Tipo de movimiento</label>
        <div class="grid grid-cols-2 gap-2 p-1 rounded-xl" style="background: var(--color-surface-el);">
          <button
            type="button"
            @click="form.type = 'gasto'"
            class="py-2.5 rounded-lg text-sm font-semibold transition-all duration-200"
            :style="{
              background: form.type === 'gasto' ? 'var(--color-danger)' : 'transparent',
              color: form.type === 'gasto' ? '#fff' : 'var(--color-text-muted)'
            }"
          >↓ Gasto</button>
          <button
            type="button"
            @click="form.type = 'ingreso'"
            class="py-2.5 rounded-lg text-sm font-semibold transition-all duration-200"
            :style="{
              background: form.type === 'ingreso' ? 'var(--color-primary)' : 'transparent',
              color: form.type === 'ingreso' ? '#fff' : 'var(--color-text-muted)'
            }"
          >↑ Ingreso</button>
        </div>
      </div>

      <!-- Fields -->
      <div class="flex flex-col gap-5">

        <!-- Categoría -->
        <div>
          <label class="block text-xs font-semibold uppercase tracking-widest mb-2" style="color: var(--color-text-muted);">Categoría</label>
          <select v-model="form.category" required class="form-field w-full rounded-xl px-4 py-3 text-sm transition-all focus:outline-none">
            <option value="" disabled>Seleccionar categoría...</option>
            <option v-for="cat in availableCategories" :key="cat" :value="cat">{{ cat }}</option>
          </select>
        </div>

        <!-- Monto -->
        <div>
          <label class="block text-xs font-semibold uppercase tracking-widest mb-2" style="color: var(--color-text-muted);">Monto</label>
          <div class="relative">
            <span class="absolute left-4 top-1/2 -translate-y-1/2 font-mono font-semibold text-sm" style="color: var(--color-text-muted);">$</span>
            <input
              type="number"
              v-model.number="form.amount"
              min="0"
              placeholder="0"
              required
              class="form-field w-full rounded-xl pl-8 pr-4 py-3 text-sm font-mono transition-all focus:outline-none"
            />
          </div>
        </div>

        <!-- Descripción -->
        <div>
          <label class="block text-xs font-semibold uppercase tracking-widest mb-2" style="color: var(--color-text-muted);">Descripción <span style="color: var(--color-text-muted); font-weight:400;">(opcional)</span></label>
          <input
            type="text"
            v-model="form.description"
            placeholder="Ej: Pago de luz, supermercado..."
            class="form-field w-full rounded-xl px-4 py-3 text-sm transition-all focus:outline-none"
          />
        </div>

        <!-- Fecha -->
        <div>
          <label class="block text-xs font-semibold uppercase tracking-widest mb-2" style="color: var(--color-text-muted);">Fecha</label>
          <input
            type="date"
            v-model="form.date"
            required
            class="form-field w-full rounded-xl px-4 py-3 text-sm font-mono transition-all focus:outline-none"
          />
        </div>
      </div>

      <!-- Submit -->
      <button
        type="button"
        @click="addTransaction"
        class="mt-8 w-full py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
        :style="{
          background: form.type === 'ingreso' ? 'var(--color-primary)' : 'var(--color-danger)',
          color: '#fff',
          boxShadow: form.type === 'ingreso' ? '0 4px 20px rgba(16,185,129,0.25)' : '0 4px 20px rgba(244,63,94,0.25)'
        }"
      >
        Registrar {{ form.type === 'ingreso' ? 'ingreso' : 'gasto' }}
      </button>

      <!-- Success message -->
      <Transition name="slide-up">
        <div v-if="message" class="mt-4 flex items-center gap-2 p-3 rounded-lg text-sm font-medium" style="background: var(--color-primary-dim); color: var(--color-primary);">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          {{ message }}
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed, ref } from 'vue'
import { useTransactionsStore } from '../store/transactions'

const transactionsStore = useTransactionsStore()

const form = reactive({
  type: 'gasto',
  category: '',
  amount: null,
  description: '',
  date: '',
})

const message = ref('')

const incomeCategories  = ['Sueldo', 'Venta', 'Regalo', 'Otros ingresos']
const expenseCategories = ['Comida', 'Transporte', 'Entretenimiento', 'Servicios', 'Otros gastos']

const availableCategories = computed(() =>
  form.type === 'ingreso' ? incomeCategories : expenseCategories
)

function addTransaction() {
  if (!form.category || !form.amount || !form.date) return

  transactionsStore.addTransaction({
    type:        form.type === 'ingreso' ? 'income' : 'expense',
    category:    form.category,
    amount:      form.amount,
    description: form.description,
    date:        form.date,
  })

  message.value = '¡Transacción registrada correctamente!'
  setTimeout(() => (message.value = ''), 3000)

  form.category    = ''
  form.amount      = null
  form.description = ''
  form.date        = ''
}
</script>

<style scoped>
.form-field {
  background: var(--color-surface-el);
  border: 1px solid var(--color-border);
  color: var(--color-text);
}
.form-field:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-dim);
}
.form-field::placeholder {
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
