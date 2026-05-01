import { defineStore } from 'pinia'

const STORAGE_KEY = 'gamma_settings'

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export const useSettingsStore = defineStore('settings', {
  state: () => {
    const saved = loadFromStorage()
    return {
      monthlyBudget: saved?.monthlyBudget ?? 500000,
      currency: saved?.currency ?? 'ARS',
    }
  },

  actions: {
    updateBudget(newBudget) {
      const val = Number(newBudget)
      if (!val || val <= 0) return false
      this.monthlyBudget = val
      this._persist()
      return true
    },

    updateCurrency(currency) {
      this.currency = currency
      this._persist()
    },

    _persist() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        monthlyBudget: this.monthlyBudget,
        currency: this.currency,
      }))
    },
  },
})