import { defineStore } from 'pinia'
import { useSettingsStore } from './settings'

export const useTransactionsStore = defineStore('transactions', {
  state: () => ({
    transactions: [
      { id: 1, type: 'expense', category: 'Comida', amount: 2500, date: '2025-10-05' },
      { id: 2, type: 'income', category: 'Sueldo', amount: 120000, date: '2025-10-01' },
      { id: 3, type: 'expense', category: 'Transporte', amount: 4000, date: '2025-10-10' },
    ],
  }),
  getters: {
    totalIncome: (state) => state.transactions
      .filter(t => t.type === 'income')
      .reduce((acc, t) => acc + t.amount, 0),
    totalExpenses: (state) => state.transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => acc + t.amount, 0),
    balance() {
      return this.totalIncome - this.totalExpenses
    },
    budgetAlert() {
      const settingsStore = useSettingsStore()
      const used = (this.totalExpenses / settingsStore.monthlyBudget) * 100
      return used >= 80 ? `⚠️ Has gastado el ${used.toFixed(0)}% de tu presupuesto.` : null
    }
  },
  actions: {
    addTransaction(transaction) {
      transaction.id = Date.now()
      this.transactions.push(transaction)
    },
  }
})
