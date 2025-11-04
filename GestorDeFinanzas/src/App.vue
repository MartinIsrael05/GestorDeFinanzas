<template>
  <div id="app">
    <header class="app-header">
      <div class="header-content">
        <h1 class="logo">💰 Mi Balance</h1>

        <nav class="nav">
          <RouterLink to="/" exact-active-class="active-link">Inicio</RouterLink>
          <RouterLink to="/transactions" exact-active-class="active-link">Transacciones</RouterLink>
          <RouterLink to="/add" exact-active-class="active-link">Agregar</RouterLink>
          <RouterLink to="/settings" exact-active-class="active-link">Configuración</RouterLink>
        </nav>
      </div>
    </header>

    <main>
      <RouterView />
    </main>
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
/* --- Reset básico --- */
body, html, #app {
  margin: 0;
  padding: 0;
  height: 100%;
  font-family: 'Segoe UI', Roboto, Arial, sans-serif;
  background-color: #f4f6fa;
  color: #222;
}

/* --- Header principal --- */
.app-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 65px;
  background-color: #0275d8;
  color: white;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-content {
  width: 95%;
  max-width: 1200px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  margin: 0;
  font-size: 1.4em;
  font-weight: 700;
  letter-spacing: 0.5px;
}

/* --- Navegación --- */
.nav {
  display: flex;
  gap: 20px;
}

.nav a {
  color: white;
  text-decoration: none;
  font-weight: 600;
  padding: 6px 10px;
  border-radius: 6px;
  transition: background-color 0.2s ease;
}

.nav a:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.active-link {
  background-color: rgba(255, 255, 255, 0.3);
}

/* --- Contenido principal --- */
main {
  margin-top: 85px; /* deja espacio para el header fijo */
  padding: 20px;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
  box-sizing: border-box;
}
</style>
