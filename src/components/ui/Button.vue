<template>
	<button
		:class="[
			'px-4 py-2 rounded-lg font-semibold transition-colors duration-200 focus:outline-none',
			variant === 'primary' ? 'bg-primary text-white hover:bg-primary/90' : '',
			variant === 'secondary' ? 'bg-muted/10 text-primary hover:bg-primary/10' : '',
			variant === 'danger' ? 'bg-danger text-white hover:bg-danger/90' : '',
			block ? 'w-full' : '',
			customClass
		]"
		:type="type"
		@click="$emit('click', $event)"
	>
		<slot />
	</button>
</template>

<script setup>
const props = defineProps({
	variant: { type: String, default: 'primary' },
	block: { type: Boolean, default: false },
	type: { type: String, default: 'button' },
	customClass: { type: String, default: '' }
})
</script>
