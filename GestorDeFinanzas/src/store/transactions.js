import { defineStore } from 'pinia'
import { useSettingsStore } from './settings'

export const useTransactionsStore = defineStore('transactions', {
  state: () => ({
    transactions: [
      // Junio 2025
      { id: 1, type: 'income', category: 'Salario', description: 'Salario mensual', amount: 30000, date: '2025-06-05' },
      { id: 2, type: 'expense', category: 'Alimentación', description: 'Compras supermercado', amount: 25000, date: '2025-06-08' },
      { id: 3, type: 'expense', category: 'Transporte', description: 'Gasolina', amount: 8000, date: '2025-06-10' },
      { id: 4, type: 'expense', category: 'Entretenimiento', description: 'Cine', amount: 5000, date: '2025-06-20' },
      { id: 5, type: 'expense', category: 'Servicios', description: 'Internet y electricidad', amount: 12000, date: '2025-06-25' },
      { id: 6, type: 'expense', category: 'Servicios', description: 'Internet y electricidad', amount: 1500, date: '2025-06-25' },
      
      // Julio 2025
      { id: 7, type: 'income', category: 'Salario', description: 'Salario mensual', amount: 30000, date: '2025-07-05' },
      { id: 8, type: 'expense', category: 'Alimentación', description: 'Compras supermercado', amount: 30000, date: '2025-07-08' },
      { id: 9, type: 'expense', category: 'Salud', description: 'Farmacia', amount: 5000, date: '2025-07-10' },
      { id: 10, type: 'expense', category: 'Entretenimiento', description: 'Streaming', amount: 2000, date: '2025-07-20' },
      { id: 11, type: 'expense', category: 'Servicios', description: 'Servicios básicos', amount: 48000, date: '2025-07-25' },
      { id: 12, type: 'income', category: 'Servicios', description: 'Servicios básicos', amount: 1700, date: '2025-07-25' },
      
      // Agosto 2025
      { id: 13, type: 'income', category: 'Salario', description: 'Salario mensual', amount: 30000, date: '2025-08-05' },
      { id: 14, type: 'expense', category: 'Alimentación', description: 'Compras supermercado', amount: 12000, date: '2025-08-08' },
      { id: 15, type: 'expense', category: 'Vivienda', description: 'Reparación del techo', amount: 8000, date: '2025-08-12' },
      { id: 16, type: 'expense', category: 'Entretenimiento', description: 'Concierto', amount: 2000, date: '2025-08-22' },
      { id: 17, type: 'expense', category: 'Servicios', description: 'Servicios básicos', amount: 3000, date: '2025-08-28' },
      { id: 18, type: 'income', category: 'Servicios', description: 'Servicios básicos', amount: 1600, date: '2025-08-28' },
      
      // Septiembre 2025
      { id: 19, type: 'income', category: 'Salario', description: 'Salario mensual', amount: 3000, date: '2025-09-05' },
      { id: 20, type: 'expense', category: 'Alimentación', description: 'Compras supermercado', amount: 30000, date: '2025-09-08' },
      { id: 21, type: 'expense', category: 'Educación', description: 'Curso online', amount: 5000, date: '2025-09-10' },
      { id: 22, type: 'expense', category: 'Entretenimiento', description: 'Juego', amount: 2000, date: '2025-09-18' },
      { id: 23, type: 'expense', category: 'Servicios', description: 'Servicios básicos', amount: 38000, date: '2025-09-26' },
      { id: 24, type: 'income', category: 'Servicios', description: 'Servicios básicos', amount: 1800, date: '2025-09-26' },
      
      // Octubre 2025
      { id: 25, type: 'income', category: 'Salario', description: 'Salario mensual', amount: 30000, date: '2025-10-05' },
      { id: 26, type: 'expense', category: 'Alimentación', description: 'Compras supermercado', amount: 15000, date: '2025-10-08' },
      { id: 27, type: 'expense', category: 'Transporte', description: 'Mantenimiento auto', amount: 5000, date: '2025-10-12' },
      { id: 28, type: 'expense', category: 'Entretenimiento', description: 'Restaurante', amount: 3000, date: '2025-10-20' },
      { id: 29, type: 'expense', category: 'Servicios', description: 'Servicios básicos', amount: 17000, date: '2025-10-27' },
      { id: 30, type: 'income', category: 'Servicios', description: 'Servicios básicos', amount: 1750, date: '2025-10-27' },
      
      // Noviembre 2025
      { id: 31, type: 'income', category: 'Salario', description: 'Salario mensual', amount: 30000, date: '2025-11-05' },
      { id: 32, type: 'expense', category: 'Alimentación', description: 'Compras supermercado', amount: 40000, date: '2025-11-08' },
      { id: 33, type: 'expense', category: 'Regalo', description: 'Regalo cumpleaño', amount: 15000, date: '2025-11-09' },
      { id: 34, type: 'expense', category: 'Entretenimiento', description: 'Teatro', amount: 5000, date: '2025-11-15' },
      { id: 35, type: 'income', category: 'Servicios', description: 'Servicios básicos', amount: 35000, date: '2025-11-28' },
      { id: 36, type: 'income', category: 'Servicios', description: 'Servicios básicos', amount: 1900, date: '2025-11-28' },
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

    // Cargar desde localStorage (o usar transacciones predeterminadas)
    loadFromLocalStorage() {
      // Siempre limpiar el localStorage y usar las transacciones predeterminadas
      localStorage.removeItem('transactions')
      this.saveToLocalStorage()
    },
  },
})
