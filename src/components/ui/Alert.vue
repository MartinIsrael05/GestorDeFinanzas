<template>
  <div v-if="message" class="bg-warning/10 border-l-4 border-warning text-warning p-4 rounded-xl mb-4 font-semibold flex items-center gap-2 animate-pulse">
    <svg class="w-5 h-5 text-warning" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
    {{ message }}
  </div>
</template>

<script setup>
defineProps({
  message: String
})
</script>
