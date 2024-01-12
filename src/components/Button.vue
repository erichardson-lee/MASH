<script setup lang="ts">
defineProps<{ label: string }>();
</script>

<template>
  <button class="pa-2 block bg-gray-800 text-white">{{ label }}</button>
</template>
