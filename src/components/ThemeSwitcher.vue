<template>
  <button @click="toggleTheme" class="focus:outline-none">
    <SunIcon v-if="theme === 'light'" class="text-yellow-500" />
    <MoonIcon v-else class="text-gray-400" />
  </button>
</template>

<script setup>
import { useTheme } from '../composables/useTheme'
import SunIcon from './icons/SunIcon.vue'
import MoonIcon from './icons/MoonIcon.vue'

const { theme, toggleTheme } = useTheme()
</script>
