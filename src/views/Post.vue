<template>
  <div class="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
    <h1 class="text-4xl font-bold mb-4 text-gray-900 dark:text-white">{{ post.title }}</h1>
    <div 
      v-if="post.content" 
      v-html="compiledMarkdown" 
      class="prose dark:prose-invert max-w-none"
    ></div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { db } from '../firebase'
import { doc, getDoc } from 'firebase/firestore'
import { marked } from 'marked'

const route = useRoute()
const post = ref({})

const fetchPost = async () => {
  const docRef = doc(db, 'posts', route.params.id)
  const docSnap = await getDoc(docRef)
  if (docSnap.exists()) {
    post.value = docSnap.data()
  }
}

const compiledMarkdown = computed(() => {
  return post.value.content ? marked(post.value.content) : ''
})

onMounted(fetchPost)
</script>
