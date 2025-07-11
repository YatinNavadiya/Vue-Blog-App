<template>
  <div id="app" class="bg-gray-100 dark:bg-gray-900 min-h-screen transition-colors duration-300">
    <Navbar />
    <main class="container mx-auto px-4 py-8">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import Navbar from './components/Navbar.vue'
</script>