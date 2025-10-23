import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '../views/DashboardView.vue'
import TransactionsView from '../views/TransactionsView.vue'
import AddTransactionView from '../views/AddTransactionView.vue'
import SettingsView from '../views/SettingsView.vue'

const routes = [
  { path: '/', component: DashboardView, name: 'Dashboard' },
  { path: '/transactions', component: TransactionsView, name: 'Transactions' },
  { path: '/add', component: AddTransactionView, name: 'AddTransaction' },
  { path: '/settings', component: SettingsView, name: 'Settings' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
