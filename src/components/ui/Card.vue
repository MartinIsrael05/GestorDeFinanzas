<template>
  <div :class="['p-4 rounded-lg shadow text-white', bgColor]">
    <h2 class="text-lg font-semibold mb-2">{{ title }}</h2>
    <p class="text-2xl font-bold">{{ value.toLocaleString() }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: String,
  value: Number,
  color: String
})

const bgColor = computed(() => {
  const colors = { red: 'bg-red-500', green: 'bg-green-500', blue: 'bg-blue-500' }
  return colors[props.color] || 'bg-gray-500'
})
</script>