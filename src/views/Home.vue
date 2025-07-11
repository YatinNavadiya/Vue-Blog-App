<template>
  <div>
    <!-- Header -->
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-4xl font-bold text-gray-800 dark:text-white">Latest Posts</h1>
    </div>

    <!-- Post Grid -->
    <div v-if="posts.length > 0" class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div v-for="(post, index) in posts" :key="post.id" 
           :style="{ backgroundColor: getPostColor(index) }"
           class="rounded-lg shadow-md overflow-hidden group transform hover:-translate-y-1 transition-all duration-300">
        <div class="p-6">
          <h2 class="text-2xl font-bold mb-2 text-gray-900 dark:text-white group-hover:text-blue-500 transition-colors duration-300">{{ post.title }}</h2>
          <p class="text-gray-700 dark:text-gray-300 h-24 overflow-hidden">{{ post.content.substring(0, 150) }}...</p>
        </div>
        <div class="px-6 pt-4 pb-6 bg-gray-50 dark:bg-gray-700/50 flex justify-between items-center">
          <router-link :to="{ name: 'Post', params: { id: post.id } }" class="text-blue-500 hover:underline font-semibold">Read More &rarr;</router-link>
          <div class="flex space-x-3">
            <button @click="openEditModal(post)" class="text-gray-400 hover:text-yellow-500 transition-colors duration-300">
              <EditIcon />
            </button>
            <button @click="openDeleteModal(post)" class="text-gray-400 hover:text-red-500 transition-colors duration-300">
              <DeleteIcon />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- No Posts Message -->
    <div v-else class="text-center py-16 text-gray-500 dark:text-gray-400">
      <p class="text-xl">No posts yet. Be the first to create one!</p>
    </div>

    <!-- Modals -->
    <PostEditorModal :show="showEditorModal" :post="postToEdit" @close="closeEditorModal" @save="savePost" />
    <ConfirmationModal 
      :show="showDeleteModal" 
      title="Delete Post"
      message="Are you sure you want to permanently delete this post? This action cannot be undone."
      @cancel="closeDeleteModal" 
      @confirm="handleDelete" 
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { db } from '../firebase'
import { collection, getDocs, deleteDoc, doc, query, orderBy, setDoc, addDoc, serverTimestamp } from 'firebase/firestore'
import { useEventBus } from '../composables/useEventBus'
import { useTheme } from '../composables/useTheme'

import PostEditorModal from '../components/PostEditorModal.vue'
import ConfirmationModal from '../components/ConfirmationModal.vue'
import EditIcon from '../components/icons/EditIcon.vue'
import DeleteIcon from '../components/icons/DeleteIcon.vue'

const posts = ref([])
const { on, off } = useEventBus()
const { theme } = useTheme()

// Modal states
const showEditorModal = ref(false)
const showDeleteModal = ref(false)
const postToEdit = ref(null)
const postToDelete = ref(null)

// Color Palettes
const lightColorPalette = [
  '#FFFBEB', '#FEF2F2', '#EFF6FF', '#F0FDF4', '#F5F3FF',
  '#FFF7ED', '#FEFBFB', '#F7FAFC', '#ECFDF5', '#FAF5FF'
];

const darkColorPalette = [
  '#2d3748', '#4a5568', '#2b6cb0', '#2f855a', '#553c9a',
  '#975a16', '#742a2a', '#1a202c', '#164e63', '#5b21b6'
];

const getPostColor = (index) => {
  const palette = theme.value === 'dark' ? darkColorPalette : lightColorPalette;
  return palette[index % palette.length];
};


// Fetch posts
const fetchPosts = async () => {
  const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q)
  posts.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}

// Editor Modal Logic
const openCreateModal = () => {
  postToEdit.value = null
  showEditorModal.value = true
}

const openEditModal = (post) => {
  postToEdit.value = post
  showEditorModal.value = true
}

const closeEditorModal = () => {
  showEditorModal.value = false
  postToEdit.value = null
}

// Delete Modal Logic
const openDeleteModal = (post) => {
  postToDelete.value = post
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  postToDelete.value = null
}

const handleDelete = async () => {
  if (!postToDelete.value) return
  await deleteDoc(doc(db, 'posts', postToDelete.value.id))
  fetchPosts() // Refresh list
  closeDeleteModal()
}

// Save/Update Post Logic
const savePost = async (postData) => {
  const isEditing = !!postData.id;
  
  const dataToSave = {
    ...postData,
    updatedAt: serverTimestamp(),
  };

  if (isEditing) {
    const docRef = doc(db, 'posts', postData.id)
    await setDoc(docRef, dataToSave, { merge: true });
  } else {
    dataToSave.createdAt = serverTimestamp();
    await addDoc(collection(db, 'posts'), dataToSave)
  }
  
  fetchPosts() // Refresh list
  closeEditorModal()
}

onMounted(() => {
  fetchPosts()
  on('open-create-modal', openCreateModal)
})

onUnmounted(() => {
  // It's good practice to clean up listeners, though not strictly necessary in this SPA context
  // off('open-create-modal', openCreateModal)
})
</script>
