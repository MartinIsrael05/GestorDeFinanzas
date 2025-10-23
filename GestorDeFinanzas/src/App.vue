<template>
  <div id="app">
    <header>
      <h1>💰 Mi Balance</h1>
      <nav>
        <RouterLink to="/">Inicio</RouterLink>
        <RouterLink to="/transactions">Transacciones</RouterLink>
        <RouterLink to="/add">Agregar</RouterLink>
        <RouterLink to="/settings">Configuración</RouterLink>
      </nav>
    </header>

    <main>
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<style>
body {
  margin: 0;
  font-family: Arial, sans-serif;
  background-color: #f6f7fb;
  color: #222;
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* Header */
header {
  background-color: #0275d8;
  color: white;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

header h1 {
  margin: 0;
  font-size: 1.5em;
}

nav a {
  color: white;
  margin-left: 16px;
  text-decoration: none;
  font-weight: bold;
}

nav a:hover {
  text-decoration: underline;
}

/* Main content */
main {
  flex: 1;
  padding: 20px;
}
</style>
