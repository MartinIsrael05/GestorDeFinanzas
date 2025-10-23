<template>
  <div id="app">
    <header>
      <h1>Mi Balance</h1>
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
/* --- Reset básico --- */
body, html, #app {
  margin: 0;
  padding: 0;
  height: 100%;
  font-family: Arial, sans-serif;
  background-color: #f6f7fb;
  color: #222;
}

/* --- Header fijo arriba --- */
header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background-color: #0275d8;
  color: white;
  display: flex;
  align-items: center;
  padding: 0 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  z-index: 1000;
}

/* Título */
header h1 {
  margin: 0;
  font-size: 1.3em;
}

/* Navegación */
nav a {
  color: white;
  margin-left: 16px;
  text-decoration: none;
  font-weight: bold;
}

nav a:hover {
  text-decoration: underline;
}

/* --- Contenido principal debajo del header --- */
main {
  margin-top: 70px; /* deja espacio para el header */
  padding: 20px;
}
</style>