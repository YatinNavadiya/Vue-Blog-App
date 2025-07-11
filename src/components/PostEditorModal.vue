<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl transform transition-all" ref="modalContent">
      <div class="p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-2xl font-bold text-gray-800 dark:text-white">{{ isEditing ? 'Edit Post' : 'Create New Post' }}</h2>
          <button @click="close" class="text-gray-400 hover:text-gray-600 dark:hover:text-white">
            <CloseIcon />
          </button>
        </div>
        <form @submit.prevent="save">
          <div class="mb-4">
            <label for="title" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
            <input type="text" id="title" v-model="editablePost.title" class="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500" required>
          </div>
          <div class="mb-6">
            <label for="content" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Content (Markdown Supported)</label>
            <textarea id="content" v-model="editablePost.content" class="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500" rows="12" required></textarea>
          </div>
          <div class="flex justify-end">
            <button type="button" @click="close" class="px-4 py-2 mr-3 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 rounded-lg">Cancel</button>
            <button type="submit" class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg">{{ isEditing ? 'Update Post' : 'Create Post' }}</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import CloseIcon from './icons/CloseIcon.vue'

const props = defineProps({
  show: Boolean,
  post: Object
})

const emit = defineEmits(['close', 'save'])

const editablePost = ref({})
const isEditing = computed(() => !!(props.post && props.post.id))

watch(() => props.show, (newVal) => {
  if (newVal) {
    editablePost.value = props.post ? { ...props.post } : { title: '', content: '' }
  }
})

const close = () => emit('close')
const save = () => emit('save', editablePost.value)
</script>
