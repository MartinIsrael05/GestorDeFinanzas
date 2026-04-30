<template>
  <div v-if="message" class="bg-yellow-100 border border-yellow-400 text-yellow-700 p-3 rounded-lg mb-4">
    {{ message }}
  </div>
</template>

<script setup>
defineProps({
  message: String
})
</script>
