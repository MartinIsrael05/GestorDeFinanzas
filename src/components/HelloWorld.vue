<script setup>
defineProps({
  msg: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <div class="flex flex-col items-center justify-center py-10">
    <h1 class="text-3xl md:text-4xl font-bold text-success mb-2">{{ msg }}</h1>
    <h3 class="text-lg text-muted font-medium">
      ¡Proyecto creado con
      <a href="https://vite.dev/" target="_blank" rel="noopener" class="text-primary underline hover:text-accent transition">Vite</a>
      +
      <a href="https://vuejs.org/" target="_blank" rel="noopener" class="text-primary underline hover:text-accent transition">Vue 3</a>!
    </h3>
  </div>
</template>

<!-- Sin estilos, todo con Tailwind -->
