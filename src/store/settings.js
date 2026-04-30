import { defineStore } from 'pinia'

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    monthlyBudget: 500000,
    currency: 'ARS',
  }),
})
