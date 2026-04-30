<template>
  <div id="app" class="min-h-screen flex flex-col bg-background">
    <header class="sticky top-0 z-30 bg-primary text-white shadow-lg">
      <div class="grid grid-cols-1 md:grid-cols-3 items-center max-w-7xl mx-auto px-4 py-4 gap-2">
        <h1 class="col-span-1 md:col-span-1 text-3xl md:text-4xl font-extrabold tracking-tight font-display drop-shadow-sm transition-all duration-500">Mi Balance</h1>
        <nav class="col-span-1 md:col-span-2 flex flex-wrap justify-center md:justify-end gap-2 md:gap-4">
          <RouterLink to="/" exact-active-class="active-link" class="px-4 py-2 rounded-xl font-semibold hover:bg-primary/90 transition-all duration-300">Inicio</RouterLink>
          <RouterLink to="/transactions" exact-active-class="active-link" class="px-4 py-2 rounded-xl font-semibold hover:bg-primary/90 transition-all duration-300">Transacciones</RouterLink>
          <RouterLink to="/add" exact-active-class="active-link" class="px-4 py-2 rounded-xl font-semibold hover:bg-primary/90 transition-all duration-300">Agregar</RouterLink>
          <RouterLink to="/settings" exact-active-class="active-link" class="px-4 py-2 rounded-xl font-semibold hover:bg-primary/90 transition-all duration-300">Configuración</RouterLink>
        </nav>
      </div>
    </header>
    <main class="flex-1 w-full max-w-7xl mx-auto px-2 md:px-8 py-8 transition-all duration-500">
      <RouterView />
    </main>
    <footer class="bg-surface border-t border-muted py-6 text-center text-muted text-base mt-12 font-medium tracking-wide">
      &copy; {{ new Date().getFullYear() }} <span class="font-bold">Mi Balance</span>. Todos los derechos reservados.
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
</script>

<style>
.active-link {
  background-color: rgba(255,255,255,0.18) !important;
  color: #fff !important;
  box-shadow: 0 2px 8px 0 rgba(37,99,235,0.10);
  text-shadow: 0 1px 2px rgba(0,0,0,0.08);
  transition: background-color 0.3s, box-shadow 0.3s, color 0.3s;
}
</style>
