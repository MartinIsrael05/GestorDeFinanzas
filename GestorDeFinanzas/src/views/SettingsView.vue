<template>
  <div class="settings">
    <h1>Configuración</h1>

    <section>
      <h2>Presupuesto Mensual</h2>
      <input type="number" v-model.number="newBudget" />
      <button @click="updateBudget">Actualizar</button>
      <p>Presupuesto actual: {{ settingsStore.monthlyBudget.toLocaleString('es-AR') }} {{ settingsStore.currency }}</p>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useSettingsStore } from '../store/settings'

const settingsStore = useSettingsStore()
const newBudget = ref(settingsStore.monthlyBudget)
const newCategory = ref('')

function updateBudget() {
  settingsStore.updateBudget(newBudget.value)
  alert('Presupuesto actualizado correctamente.')
}


</script>

<style scoped>
.settings {
  padding: 20px;
  font-family: Arial, sans-serif;
}

section {
  margin-bottom: 20px;
}

h2 {
  font-size: 18px;
  margin-bottom: 10px;
}

input {
  padding: 8px;
  margin-right: 8px;
  font-size: 14px;
}

button {
  background-color: #0275d8;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #0256a1;
}
</style>
