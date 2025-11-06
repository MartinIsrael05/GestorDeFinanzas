import { defineStore } from 'pinia'
import { useSettingsStore } from './settings'

export const useTransactionsStore = defineStore('transactions', {
  state: () => ({
    transactions: [],
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
      // gastos agrupados por categoría
  expensesByCategory: (state) => {
    const grouped = {}
    state.transactions.forEach(t => {
      if (t.type === 'expense') {
        grouped[t.category] = (grouped[t.category] || 0) + t.amount
      }
    })
    return grouped
  },

  // resumen mensual
  monthlySummary: (state) => {
    const summary = {}
    state.transactions.forEach(t => {
      const month = t.date.slice(0, 7) // formato YYYY-MM
      if (!summary[month]) {
        summary[month] = { income: 0, expense: 0 }
      }
      summary[month][t.type] += t.amount
    })
    return summary
  }
  },

  actions: {
    // Agregar una transacción
    addTransaction(transaction) {
      transaction.id = Date.now()
      this.transactions.push(transaction)
      this.saveToLocalStorage() // guardar después de agregar
    },

    // Guardar en localStorage
    saveToLocalStorage() {
      localStorage.setItem('transactions', JSON.stringify(this.transactions))
    },

    // Cargar desde localStorage
    loadFromLocalStorage() {
      const saved = localStorage.getItem('transactions')
      if (saved) {
        this.transactions = JSON.parse(saved)
      }
    },

    /* Borrar todo (opcional)
    clearAll() {
      this.transactions = []
      localStorage.removeItem('transactions')
    },*/
  },
})
