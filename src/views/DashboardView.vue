<template>
  <div class="dash-wrapper">

    <!-- Page Header -->
    <div class="dash-header">
      <div>
        <p class="section-label">Panel principal</p>
        <h1 class="page-title">Resumen Financiero</h1>
        <p class="page-subtitle">{{ currentMonthLabel }}</p>
      </div>
      <div class="month-selector-wrapper">
        <label class="selector-label">Período</label>
        <select id="month" v-model="selectedMonth" class="month-select">
          <option v-for="m in availableMonths" :key="m.value" :value="m.value">{{ m.label }}</option>
        </select>
      </div>
    </div>

    <!-- KPI Cards -->
    <div class="kpi-grid">

      <!-- Ingresos -->
      <div class="kpi-card kpi-card--income card-1">
        <div class="kpi-top">
          <div class="kpi-icon kpi-icon--income">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
            </svg>
          </div>
          <span class="badge badge-income">Ingreso</span>
        </div>
        <p class="kpi-label">Total ingresos</p>
        <p class="kpi-value kpi-value--income">${{ totalIncome.toLocaleString('es-AR') }}</p>
      </div>

      <!-- Gastos -->
      <div class="kpi-card kpi-card--expense card-2">
        <div class="kpi-top">
          <div class="kpi-icon kpi-icon--expense">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f43f5e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/>
            </svg>
          </div>
          <span class="badge badge-expense">Gasto</span>
        </div>
        <p class="kpi-label">Total gastos</p>
        <p class="kpi-value kpi-value--expense">${{ totalExpense.toLocaleString('es-AR') }}</p>
      </div>

      <!-- Balance -->
      <div class="kpi-card kpi-card--balance card-3">
        <div class="kpi-top">
          <div class="kpi-icon kpi-icon--balance">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
          </div>
          <span class="badge badge-balance">Balance</span>
        </div>
        <p class="kpi-label">Balance actual</p>
        <p class="kpi-value" :class="balance >= 0 ? 'kpi-value--income' : 'kpi-value--expense'">
          {{ balance >= 0 ? '+' : '' }}${{ balance.toLocaleString('es-AR') }}
        </p>
      </div>
    </div>

    <!-- Detail row -->
    <div class="detail-grid">

      <!-- Presupuesto -->
      <div class="detail-card card-4">
        <h3 class="card-title">Presupuesto mensual</h3>
        <div class="budget-amounts">
          <div>
            <p class="kpi-label">Gastado</p>
            <p class="budget-main">${{ totalExpense.toLocaleString('es-AR') }}</p>
          </div>
          <div class="budget-right">
            <p class="kpi-label">Límite</p>
            <p class="budget-limit">${{ monthlyBudget.toLocaleString('es-AR') }}</p>
          </div>
        </div>
        <div class="progress-track">
          <div
            class="progress-fill"
            :style="{
              width: budgetUsedPercent + '%',
              background: budgetUsedPercent >= 80
                ? 'var(--color-danger)'
                : 'linear-gradient(90deg, #10b981, #34d399)'
            }"
          ></div>
        </div>
        <div class="budget-footer">
          <span class="budget-remaining" :class="remainingBudget < 0 ? 'text-danger' : 'text-income'">
            Restante: ${{ remainingBudget.toLocaleString('es-AR') }}
          </span>
          <span class="budget-pct" :class="budgetUsedPercent >= 80 ? 'text-danger' : ''">
            {{ budgetUsedPercent.toFixed(0) }}%
          </span>
        </div>
        <div v-if="budgetAlert" class="budget-alert">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          Superaste el 80% del presupuesto
        </div>
      </div>

      <!-- Últimas transacciones -->
      <div class="detail-card card-5">
        <div class="card-header-row">
          <h3 class="card-title">Últimas transacciones</h3>
          <RouterLink to="/transactions" class="link-small">Ver todas →</RouterLink>
        </div>

        <div v-if="latestTransactions.length === 0" class="empty-state">
          Sin transacciones este mes
        </div>

        <ul class="tx-list">
          <li v-for="t in latestTransactions" :key="t.id" class="tx-item">
            <div class="tx-left">
              <div class="tx-icon" :class="t.type === 'income' ? 'tx-icon--income' : 'tx-icon--expense'">
                {{ t.category.charAt(0) }}
              </div>
              <div>
                <p class="tx-cat">{{ t.category }}</p>
                <p class="tx-desc">{{ t.description || 'Sin descripción' }}</p>
              </div>
            </div>
            <strong class="tx-amount" :class="t.type === 'income' ? 'text-income' : 'text-danger'">
              {{ t.type === 'income' ? '+' : '-' }}${{ t.amount.toLocaleString('es-AR') }}
            </strong>
          </li>
        </ul>

        <RouterLink to="/add" class="btn-add">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Nueva transacción
        </RouterLink>
      </div>

      <!-- Proyección -->
      <div class="detail-card card-6">
        <div>
          <h3 class="card-title">Proyección</h3>
          <p class="card-subtitle">Estimado para {{ nextMonthLabel }}</p>
        </div>

        <div class="proj-list">
          <div class="proj-row">
            <span class="proj-label">Ingreso estimado</span>
            <span class="proj-value text-income">${{ projectedIncome.toLocaleString('es-AR') }}</span>
          </div>
          <div class="proj-row">
            <span class="proj-label">Gasto estimado</span>
            <span class="proj-value text-danger">${{ projectedExpense.toLocaleString('es-AR') }}</span>
          </div>
          <div class="proj-row proj-row--balance" :class="projectedBalance >= 0 ? 'proj-row--positive' : 'proj-row--negative'">
            <span class="proj-label-bold" :class="projectedBalance >= 0 ? 'text-income' : 'text-danger'">Balance proyectado</span>
            <span class="proj-value-bold" :class="projectedBalance >= 0 ? 'text-income' : 'text-danger'">
              {{ projectedBalance >= 0 ? '+' : '' }}${{ projectedBalance.toLocaleString('es-AR') }}
            </span>
          </div>
        </div>

        <p class="proj-note">Promedio de los 2 meses anteriores a {{ currentMonthLabel }}</p>
      </div>
    </div>

    <!-- Charts -->
    <div class="charts-grid">
      <div class="detail-card chart-card card-7">
        <CategoryChart :selectedMonth="selectedMonth" />
      </div>
      <div class="detail-card chart-card card-8">
        <MonthlyComparisonChart />
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useTransactionsStore } from '../store/transactions'
import { useSettingsStore } from '../store/settings'
import { RouterLink } from 'vue-router'
import CategoryChart from '../components/charts/CategoryChart.vue'
import MonthlyComparisonChart from '../components/charts/MonthlyComparisonChart.vue'

const transactionsStore = useTransactionsStore()
const settingsStore = useSettingsStore()
const { transactions } = storeToRefs(transactionsStore)

const monthLabels = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']

const availableMonths = computed(() => {
  const months = []
  for (let i = 0; i < 6; i++) {
    const month = 11 - i
    const value = `2025-${String(month).padStart(2,'0')}`
    months.push({ label: `${monthLabels[month-1]} 2025`, value })
  }
  return months.reverse()
})

const selectedMonth = ref('2025-11')
const currentMonthLabel = computed(() => availableMonths.value.find(m => m.value === selectedMonth.value)?.label || '')

const nextMonthLabel = computed(() => {
  const [y, m] = selectedMonth.value.split('-').map(Number)
  const d = new Date(y, m - 1)
  d.setMonth(d.getMonth() + 1)
  return `${monthLabels[d.getMonth()]} ${d.getFullYear()}`
})

const filteredTransactions = computed(() =>
  transactions.value.filter(t => t.date.startsWith(selectedMonth.value))
)

const totalIncome  = computed(() => filteredTransactions.value.filter(t => t.type === 'income').reduce((a,t) => a + t.amount, 0))
const totalExpense = computed(() => filteredTransactions.value.filter(t => t.type === 'expense').reduce((a,t) => a + t.amount, 0))
const balance      = computed(() => totalIncome.value - totalExpense.value)

const monthlyBudget     = computed(() => settingsStore.monthlyBudget)
const remainingBudget   = computed(() => monthlyBudget.value - totalExpense.value)
const budgetUsedPercent = computed(() => Math.min((totalExpense.value / monthlyBudget.value) * 100, 100))
const budgetAlert       = computed(() => budgetUsedPercent.value >= 80)

const latestTransactions = computed(() => filteredTransactions.value.slice(-5).reverse())

function getPrevMonthKey(baseYm, n) {
  const [y, m] = baseYm.split('-').map(Number)
  const d = new Date(y, m - 1)
  d.setMonth(d.getMonth() - n)
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`
}

const expenseForMonth = k => transactions.value.filter(t => t.date.startsWith(k) && t.type === 'expense').reduce((a,t) => a+t.amount, 0)
const incomeForMonth  = k => transactions.value.filter(t => t.date.startsWith(k) && t.type === 'income').reduce((a,t) => a+t.amount, 0)

const projectedExpense = computed(() => Math.round((expenseForMonth(getPrevMonthKey(selectedMonth.value,1)) + expenseForMonth(getPrevMonthKey(selectedMonth.value,2))) / 2))
const projectedIncome  = computed(() => Math.round((incomeForMonth(getPrevMonthKey(selectedMonth.value,1)) + incomeForMonth(getPrevMonthKey(selectedMonth.value,2))) / 2))
const projectedBalance = computed(() => projectedIncome.value - projectedExpense.value)
</script>

<style scoped>
/* ── Layout ─────────────────────────────────────────── */
.dash-wrapper   { display:flex; flex-direction:column; gap:2.5rem; }

.dash-header    { display:flex; flex-wrap:wrap; justify-content:space-between; align-items:flex-end; gap:1rem; }
.section-label  { font-size:.75rem; font-weight:600; text-transform:uppercase; letter-spacing:.1em; color:var(--color-primary); margin-bottom:.25rem; }
.page-title     { font-family:var(--font-display); font-size:2.25rem; font-weight:600; color:var(--color-text); line-height:1.1; }
.page-subtitle  { font-size:.875rem; color:var(--color-text-muted); margin-top:.25rem; }

.month-selector-wrapper { display:flex; align-items:center; gap:.75rem; }
.selector-label { font-size:.7rem; font-weight:600; text-transform:uppercase; letter-spacing:.1em; color:var(--color-text-muted); }
.month-select   {
  background:var(--color-surface); border:1px solid var(--color-border);
  color:var(--color-text); border-radius:.75rem; padding:.5rem 1rem;
  font-size:.875rem; font-family:var(--font-body); cursor:pointer;
  transition:border-color .2s;
}
.month-select:focus { outline:none; border-color:var(--color-primary); }

/* ── KPI Grid ───────────────────────────────────────── */
.kpi-grid { display:grid; grid-template-columns:repeat(auto-fit, minmax(220px,1fr)); gap:1.25rem; }

.kpi-card {
  background:var(--color-surface); border:1px solid var(--color-border);
  border-radius:1rem; padding:1.5rem;
  transition:transform .25s cubic-bezier(.16,1,.3,1), box-shadow .25s, border-color .25s;
}
.kpi-card:hover { transform:translateY(-3px); box-shadow:0 12px 32px rgba(0,0,0,.45); }
.kpi-card--balance { border-color:rgba(245,158,11,.2); }

.kpi-top    { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:1rem; }
.kpi-icon   { width:2.5rem; height:2.5rem; border-radius:.75rem; display:flex; align-items:center; justify-content:center; }
.kpi-icon--income  { background:var(--color-primary-dim); }
.kpi-icon--expense { background:var(--color-danger-dim); }
.kpi-icon--balance { background:var(--color-gold-dim); }

.kpi-label  { font-size:.7rem; text-transform:uppercase; letter-spacing:.08em; color:var(--color-text-muted); margin-bottom:.35rem; }
.kpi-value  { font-family:var(--font-display); font-size:2rem; font-weight:600; line-height:1; }
.kpi-value--income  { color:var(--color-primary); }
.kpi-value--expense { color:var(--color-danger); }

/* ── Detail Grid ────────────────────────────────────── */
.detail-grid { display:grid; grid-template-columns:repeat(auto-fit, minmax(280px,1fr)); gap:1.25rem; }

.detail-card {
  background:var(--color-surface); border:1px solid var(--color-border);
  border-radius:1rem; padding:1.5rem;
  transition:transform .25s cubic-bezier(.16,1,.3,1), box-shadow .25s, border-color .25s;
}
.detail-card:hover { transform:translateY(-2px); box-shadow:0 8px 28px rgba(0,0,0,.4); border-color:rgba(16,185,129,.2); }

.card-title      { font-family:var(--font-display); font-size:1.1rem; font-weight:600; color:var(--color-text); margin-bottom:1.25rem; }
.card-subtitle   { font-size:.8rem; color:var(--color-text-muted); margin-top:.2rem; }
.card-header-row { display:flex; justify-content:space-between; align-items:center; margin-bottom:1.25rem; }
.card-header-row .card-title { margin-bottom:0; }
.link-small      { font-size:.75rem; font-weight:600; color:var(--color-primary); text-decoration:none; transition:opacity .2s; }
.link-small:hover { opacity:.7; }

/* ── Budget ─────────────────────────────────────────── */
.budget-amounts { display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:.75rem; }
.budget-main    { font-size:1.5rem; font-weight:600; color:var(--color-text); font-family:var(--font-mono); }
.budget-right   { text-align:right; }
.budget-limit   { font-size:1rem; font-weight:500; color:var(--color-text-sub); font-family:var(--font-mono); }
.progress-track { width:100%; background:var(--color-surface-el); border-radius:99px; height:6px; overflow:hidden; margin-bottom:.5rem; }
.progress-fill  { height:100%; border-radius:99px; transition:width .7s cubic-bezier(.16,1,.3,1); }
.budget-footer  { display:flex; justify-content:space-between; font-size:.75rem; }
.budget-remaining, .budget-pct { font-weight:500; }
.budget-alert   { margin-top:.75rem; display:flex; align-items:center; gap:.4rem; padding:.65rem .75rem; border-radius:.6rem; font-size:.75rem; font-weight:500; background:var(--color-danger-dim); color:var(--color-danger); }

/* ── Transactions ───────────────────────────────────── */
.empty-state { font-size:.875rem; color:var(--color-text-muted); text-align:center; padding:1.5rem 0; }
.tx-list     { display:flex; flex-direction:column; gap:.6rem; margin-bottom:1rem; }
.tx-item     { display:flex; justify-content:space-between; align-items:center; padding:.5rem 0; border-bottom:1px solid var(--color-border); }
.tx-item:last-child { border-bottom:none; }
.tx-left     { display:flex; align-items:center; gap:.65rem; }
.tx-icon     { width:2rem; height:2rem; border-radius:.5rem; display:flex; align-items:center; justify-content:center; font-size:.7rem; font-weight:700; flex-shrink:0; }
.tx-icon--income  { background:var(--color-primary-dim); color:var(--color-primary); }
.tx-icon--expense { background:var(--color-danger-dim); color:var(--color-danger); }
.tx-cat  { font-size:.85rem; font-weight:500; color:var(--color-text); }
.tx-desc { font-size:.75rem; color:var(--color-text-muted); }
.tx-amount { font-size:.85rem; font-family:var(--font-mono); font-weight:600; }

.btn-add {
  display:flex; align-items:center; justify-content:center; gap:.4rem;
  width:100%; padding:.75rem; border-radius:.75rem;
  background:var(--color-primary); color:#fff;
  font-size:.875rem; font-weight:600; text-decoration:none;
  transition:opacity .2s, transform .15s;
}
.btn-add:hover { opacity:.9; transform:translateY(-1px); }

/* ── Projection ─────────────────────────────────────── */
.proj-list        { display:flex; flex-direction:column; gap:.75rem; margin:1rem 0; }
.proj-row         { display:flex; justify-content:space-between; align-items:center; padding:.7rem .9rem; border-radius:.6rem; background:var(--color-surface-el); }
.proj-row--balance { border:1px solid; }
.proj-row--positive { border-color:rgba(16,185,129,.3); background:rgba(16,185,129,.06); }
.proj-row--negative { border-color:rgba(244,63,94,.3); background:rgba(244,63,94,.06); }
.proj-label      { font-size:.85rem; color:var(--color-text-sub); }
.proj-label-bold { font-size:.85rem; font-weight:600; }
.proj-value      { font-size:.875rem; font-family:var(--font-mono); font-weight:600; }
.proj-value-bold { font-size:.9rem; font-family:var(--font-mono); font-weight:700; }
.proj-note       { font-size:.72rem; color:var(--color-text-muted); }

/* ── Charts ─────────────────────────────────────────── */
.charts-grid { display:grid; grid-template-columns:repeat(auto-fit, minmax(300px,1fr)); gap:1.25rem; }
.chart-card  { min-height:320px; }

/* ── Colors ─────────────────────────────────────────── */
.text-income { color:var(--color-primary); }
.text-danger { color:var(--color-danger); }

/* ── Badge ──────────────────────────────────────────── */
.badge         { display:inline-flex; align-items:center; padding:.2rem .65rem; border-radius:99px; font-size:.7rem; font-weight:500; letter-spacing:.03em; }
.badge-income  { background:var(--color-primary-dim); color:var(--color-primary); }
.badge-expense { background:var(--color-danger-dim); color:var(--color-danger); }
.badge-balance { background:var(--color-gold-dim); color:var(--color-gold); }

/* ── Stagger animations ─────────────────────────────── */
@keyframes fadeUp {
  from { opacity:0; transform:translateY(18px); }
  to   { opacity:1; transform:translateY(0); }
}
.card-1, .card-2, .card-3,
.card-4, .card-5, .card-6,
.card-7, .card-8 {
  animation: fadeUp .55s cubic-bezier(.16,1,.3,1) both;
}
.card-1 { animation-delay:.05s; }
.card-2 { animation-delay:.10s; }
.card-3 { animation-delay:.15s; }
.card-4 { animation-delay:.20s; }
.card-5 { animation-delay:.25s; }
.card-6 { animation-delay:.30s; }
.card-7 { animation-delay:.35s; }
.card-8 { animation-delay:.40s; }
</style>
