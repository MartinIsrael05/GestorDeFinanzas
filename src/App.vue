<template>
  <div id="app" class="min-h-screen flex flex-col" style="background: var(--color-bg);">

    <!-- Header -->
    <header class="sticky top-0 z-30 border-b" style="background: rgba(15,18,28,0.85); backdrop-filter: blur(16px); border-color: var(--color-border);">
      <div class="max-w-7xl mx-auto px-6 py-0 flex items-center justify-between h-16">
        <!-- Logo + Brand -->
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg flex items-center justify-center" style="background: var(--color-primary-dim); border: 1px solid rgba(16,185,129,0.3);">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 1.5C4.41 1.5 1.5 4.41 1.5 8s2.91 6.5 6.5 6.5 6.5-2.91 6.5-6.5S11.59 1.5 8 1.5zm.75 9.25H7.25V7.25h1.5v3.5zm0-5H7.25v-1.5h1.5v1.5z" fill="#10b981"/>
            </svg>
          </div>
          <span class="font-display text-xl font-semibold tracking-tight" style="color: var(--color-text);">
            Mi Balance
          </span>
        </div>

        <!-- Nav -->
        <nav class="flex items-center gap-1">
          <RouterLink
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            exact-active-class="nav-active"
            class="nav-link px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
          >
            {{ link.label }}
          </RouterLink>
        </nav>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1 w-full max-w-7xl mx-auto px-6 py-10">
      <RouterView />
    </main>

    <!-- Footer -->
    <footer class="border-t py-6" style="border-color: var(--color-border);">
      <div class="max-w-7xl mx-auto px-6 flex items-center justify-between text-xs" style="color: var(--color-text-muted);">
        <span class="font-display font-medium" style="color: var(--color-text-sub);">Mi Balance</span>
        <span>&copy; {{ new Date().getFullYear() }} — Desarrollado por <strong style="color: var(--color-text-sub); font-weight:600;">Martín Israel</strong></span>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { onMounted } from 'vue'
import { useTransactionsStore } from './store/transactions'

const store = useTransactionsStore()

onMounted(() => {
  if (store.loadFromLocalStorage) {
    store.loadFromLocalStorage()
  }
})

const navLinks = [
  { to: '/',            label: 'Inicio' },
  { to: '/transactions',label: 'Transacciones' },
  { to: '/add',         label: 'Agregar' },
  { to: '/settings',    label: 'Configuración' },
]
</script>

<style>
.nav-link {
  color: var(--color-text-sub);
}
.nav-link:hover {
  color: var(--color-text);
  background: rgba(255,255,255,0.05);
}
.nav-active {
  color: var(--color-primary) !important;
  background: var(--color-primary-dim) !important;
}
</style>
