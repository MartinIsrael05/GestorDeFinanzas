<template>
  <div :class="['p-6 rounded-xl shadow-card bg-surface text-muted', bgColor]">
    <h2 v-if="title" class="text-lg font-semibold mb-2">{{ title }}</h2>
    <p v-if="value !== undefined" class="text-2xl font-bold">{{ value.toLocaleString() }}</p>
    <slot />
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
  const colors = {
    red: 'bg-danger text-white',
    green: 'bg-success text-white',
    blue: 'bg-primary text-white',
    white: 'bg-surface text-muted',
    gray: 'bg-muted/10 text-muted',
  }
  return colors[props.color] || ''
})
</script>