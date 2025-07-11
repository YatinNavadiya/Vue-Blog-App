<template>
  <nav class="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-40">
    <div class="container mx-auto px-4">
      <div class="flex justify-between items-center py-3">
        <router-link to="/">
          <Logo />
        </router-link>
        <div class="flex items-center space-x-2">
          <router-link to="/" class="flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium">
            <HomeIcon class="mr-2" />
            <span>Home</span>
          </router-link>
          <button @click="openCreateModal" class="flex items-center text-white bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium">
            <CreateIcon class="mr-2" />
            <span>Create Post</span>
          </button>
          <ThemeSwitcher />
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useEventBus } from '../composables/useEventBus'
import Logo from './Logo.vue'
import ThemeSwitcher from './ThemeSwitcher.vue'
import HomeIcon from './icons/HomeIcon.vue'
import CreateIcon from './icons/CreateIcon.vue'

const { emit } = useEventBus()

const openCreateModal = () => {
  emit('open-create-modal')
}
</script>
