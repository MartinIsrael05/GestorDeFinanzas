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
          <div class="flex flex-col leading-none">
            <span class="font-display text-xl font-semibold tracking-tight" style="color: var(--color-text);">
              Gamma
            </span>
            <span class="text-xs font-medium tracking-widest uppercase" style="color: var(--color-primary); font-size: 9px; letter-spacing: 0.18em;">
              Finance Manager
            </span>
          </div>
        </div>

        <!-- Desktop Nav -->
        <nav class="hidden md:flex items-center gap-1">
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

        <!-- Hamburger Button (mobile only) -->
        <button
          class="md:hidden flex flex-col justify-center items-center w-9 h-9 rounded-lg gap-1.5 transition-all duration-200"
          style="background: rgba(255,255,255,0.04); border: 1px solid var(--color-border);"
          @click="menuOpen = !menuOpen"
          aria-label="Menú"
        >
          <span
            class="block w-5 h-0.5 transition-all duration-200 origin-center"
            style="background: var(--color-text);"
            :style="menuOpen ? 'transform: translateY(8px) rotate(45deg)' : ''"
          ></span>
          <span
            class="block w-5 h-0.5 transition-all duration-200"
            style="background: var(--color-text);"
            :style="menuOpen ? 'opacity: 0; transform: scaleX(0)' : ''"
          ></span>
          <span
            class="block w-5 h-0.5 transition-all duration-200 origin-center"
            style="background: var(--color-text);"
            :style="menuOpen ? 'transform: translateY(-8px) rotate(-45deg)' : ''"
          ></span>
        </button>
      </div>

      <!-- Mobile Menu Drawer -->
      <div
        v-show="menuOpen"
        class="md:hidden border-t px-4 py-3 flex flex-col gap-1"
        style="background: rgba(15,18,28,0.97); border-color: var(--color-border);"
      >
        <RouterLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          exact-active-class="nav-active"
          class="nav-link px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 block"
          @click="menuOpen = false"
        >
          {{ link.label }}
        </RouterLink>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1 w-full max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-10">
      <RouterView />
    </main>

    <!-- Footer -->
    <footer class="border-t py-6" style="border-color: var(--color-border);">
      <div class="max-w-7xl mx-auto px-6 flex items-center justify-between text-xs" style="color: var(--color-text-muted);">
        <div class="flex flex-col leading-none">
          <span class="font-display font-semibold" style="color: var(--color-text-sub);">Gamma</span>
          <span style="font-size: 9px; letter-spacing: 0.15em; text-transform: uppercase; color: var(--color-primary);">Finance Manager</span>
        </div>
        <span>&copy; {{ new Date().getFullYear() }} — Desarrollado por <strong style="color: var(--color-text-sub); font-weight:600;">Martín Israel</strong></span>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { onMounted, ref } from 'vue'
import { useTransactionsStore } from './store/transactions'

const store = useTransactionsStore()
const menuOpen = ref(false)

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