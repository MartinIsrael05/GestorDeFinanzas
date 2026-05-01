import { defineStore } from 'pinia'
import { useSettingsStore } from './settings'

// Helper: devuelve "YYYY-MM" relativo al mes actual
// offset = 0 → mes actual, -1 → mes pasado, +1 → mes próximo, etc.
function monthKey(offset = 0, day = 5) {
  const d = new Date()
  d.setDate(1)
  d.setMonth(d.getMonth() + offset)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(Math.min(day, 28)).padStart(2, '0')
  return `${y}-${m}-${dd}`
}

export const useTransactionsStore = defineStore('transactions', {
  state: () => ({
    transactions: [
      // ── Mes actual - 3 ────────────────────────────────────────────
      { id: 1, type: 'income', category: 'Sueldo', description: 'Sueldo mensual', amount: 320000, date: monthKey(-3, 5) },
      { id: 2, type: 'expense', category: 'Comida', description: 'Compras supermercado', amount: 85000, date: monthKey(-3, 8) },
      { id: 3, type: 'expense', category: 'Transporte', description: 'Gasolina', amount: 22000, date: monthKey(-3, 10) },
      { id: 4, type: 'expense', category: 'Entretenimiento', description: 'Cine + cena', amount: 18000, date: monthKey(-3, 14) },
      { id: 5, type: 'expense', category: 'Servicios', description: 'Internet y electricidad', amount: 32000, date: monthKey(-3, 20) },
      { id: 6, type: 'income', category: 'Freelance', description: 'Proyecto web cliente', amount: 75000, date: monthKey(-3, 22) },
      { id: 7, type: 'expense', category: 'Salud', description: 'Farmacia', amount: 8500, date: monthKey(-3, 25) },

      // ── Mes actual - 2 ────────────────────────────────────────────
      { id: 8, type: 'income', category: 'Sueldo', description: 'Sueldo mensual', amount: 320000, date: monthKey(-2, 5) },
      { id: 9, type: 'expense', category: 'Comida', description: 'Compras supermercado', amount: 92000, date: monthKey(-2, 7) },
      { id: 10, type: 'expense', category: 'Transporte', description: 'Mantenimiento auto', amount: 35000, date: monthKey(-2, 10) },
      { id: 11, type: 'expense', category: 'Servicios', description: 'Servicios básicos', amount: 28000, date: monthKey(-2, 15) },
      { id: 12, type: 'income', category: 'Freelance', description: 'Diseño identidad marca', amount: 90000, date: monthKey(-2, 18) },
      { id: 13, type: 'expense', category: 'Entretenimiento', description: 'Streaming + salida', amount: 12000, date: monthKey(-2, 22) },
      { id: 14, type: 'income', category: 'Venta', description: 'Venta equipos usados', amount: 45000, date: monthKey(-2, 27) },
      { id: 15, type: 'expense', category: 'Ropa', description: 'Indumentaria', amount: 24000, date: monthKey(-2, 28) },

      // ── Mes actual - 1 ────────────────────────────────────────────
      { id: 16, type: 'income', category: 'Sueldo', description: 'Sueldo mensual', amount: 320000, date: monthKey(-1, 5) },
      { id: 17, type: 'expense', category: 'Comida', description: 'Compras supermercado', amount: 110000, date: monthKey(-1, 8) },
      { id: 18, type: 'expense', category: 'Transporte', description: 'Gasolina', amount: 22000, date: monthKey(-1, 9) },
      { id: 19, type: 'income', category: 'Freelance', description: 'Ecommerce sneakers', amount: 130000, date: monthKey(-1, 12) },
      { id: 20, type: 'expense', category: 'Servicios', description: 'Servicios básicos', amount: 32000, date: monthKey(-1, 15) },
      { id: 21, type: 'expense', category: 'Salud', description: 'Médico particular', amount: 15000, date: monthKey(-1, 18) },
      { id: 22, type: 'expense', category: 'Entretenimiento', description: 'Concierto', amount: 25000, date: monthKey(-1, 20) },
      { id: 23, type: 'income', category: 'Regalo', description: 'Regalo cumpleaños', amount: 20000, date: monthKey(-1, 23) },
      { id: 24, type: 'expense', category: 'Educación', description: 'Curso diseño UX', amount: 40000, date: monthKey(-1, 26) },

      // ── Mes actual ────────────────────────────────────────────────
      { id: 25, type: 'income', category: 'Sueldo', description: 'Sueldo mensual', amount: 320000, date: monthKey(0, 5) },
      { id: 26, type: 'expense', category: 'Comida', description: 'Compras supermercado', amount: 95000, date: monthKey(0, 7) },
      { id: 27, type: 'expense', category: 'Transporte', description: 'Gasolina + peaje', amount: 18000, date: monthKey(0, 9) },
      { id: 28, type: 'income', category: 'Freelance', description: 'Landing page cliente', amount: 85000, date: monthKey(0, 12) },
      { id: 29, type: 'expense', category: 'Servicios', description: 'Internet y luz', amount: 32000, date: monthKey(0, 14) },
      { id: 30, type: 'expense', category: 'Entretenimiento', description: 'Streaming', amount: 5500, date: monthKey(0, 17) },
      { id: 31, type: 'expense', category: 'Ropa', description: 'Zapatillas stock', amount: 68000, date: monthKey(0, 20) },
      { id: 32, type: 'expense', category: 'Salud', description: 'Farmacia', amount: 9000, date: monthKey(0, 22) },
    ],
  }),

  getters: {
    totalIncome: (state) =>
      state.transactions
        .filter(t => t.type === 'income')
        .reduce((acc, t) => acc + t.amount, 0),

    totalExpenses: (state) =>
      state.transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => acc + t.amount, 0),

    balance() {
      return this.totalIncome - this.totalExpenses
    },

    budgetAlert() {
      const settingsStore = useSettingsStore()
      const used = (this.totalExpenses / settingsStore.monthlyBudget) * 100
      return used >= 80
        ? `Has gastado el ${used.toFixed(0)}% de tu presupuesto.`
        : null
    },

    expensesByCategory: (state) => {
      const grouped = {}
      state.transactions.forEach(t => {
        if (t.type === 'expense') {
          grouped[t.category] = (grouped[t.category] || 0) + t.amount
        }
      })
      return grouped
    },

    monthlySummary: (state) => {
      const summary = {}
      state.transactions.forEach(t => {
        const month = t.date.slice(0, 7)
        if (!summary[month]) {
          summary[month] = { income: 0, expense: 0 }
        }
        summary[month][t.type] += t.amount
      })
      return summary
    }
  },

  actions: {
    addTransaction(transaction) {
      transaction.id = Date.now()
      this.transactions.push(transaction)
      this.saveToLocalStorage()
    },

    saveToLocalStorage() {
      localStorage.setItem('transactions', JSON.stringify(this.transactions))
    },

    loadFromLocalStorage() {
      // En modo portfolio siempre usamos los datos de demo frescos
      // para que los meses mostrados coincidan con la fecha real del visitante.
      // Si querés persistir datos del usuario en producción, descomentá el bloque de abajo:
      //
      // const saved = localStorage.getItem('transactions')
      // if (saved) { this.transactions = JSON.parse(saved); return }
      //
      this.saveToLocalStorage()
    },
  },
})