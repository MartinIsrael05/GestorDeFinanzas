import { defineStore } from 'pinia'

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    monthlyBudget: 100000,
    currency: 'ARS',
  }),
})
