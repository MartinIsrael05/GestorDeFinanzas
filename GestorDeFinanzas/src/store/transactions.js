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
        ? `⚠️ Has gastado el ${used.toFixed(0)}% de tu presupuesto.`
        : null
    },
  },

  actions: {
    // 🔹 Agregar una transacción
    addTransaction(transaction) {
      transaction.id = Date.now()
      this.transactions.push(transaction)
      this.saveToLocalStorage() // guardar después de agregar
    },

    // 🔹 Guardar en localStorage
    saveToLocalStorage() {
      localStorage.setItem('transactions', JSON.stringify(this.transactions))
    },

    // 🔹 Cargar desde localStorage
    loadFromLocalStorage() {
      const saved = localStorage.getItem('transactions')
      if (saved) {
        this.transactions = JSON.parse(saved)
      }
    },

    // 🔹 Borrar todo (opcional)
    clearAll() {
      this.transactions = []
      localStorage.removeItem('transactions')
    },
  },
})
