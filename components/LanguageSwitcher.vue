<template>
  <div class="relative">
    <button 
      @click="toggleDropdown" 
      class="flex items-center space-x-2 bg-purple-900 bg-opacity-50 hover:bg-opacity-70 px-3 py-2 rounded-lg transition duration-300"
    >
      <span>{{ currentLocale.name }}</span>
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>
    
    <div v-if="isOpen" class="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg z-10 max-h-80 overflow-y-auto">
      <ul class="py-1">
        <li 
          v-for="locale in availableLocales" 
          :key="locale.code"
          @click="switchLanguage(locale.code)"
          class="px-4 py-2 hover:bg-purple-900 cursor-pointer transition duration-200 text-center"
        >
          {{ locale.name }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useI18n, useLocalePath } from '#imports'
import { useRouter, useRoute } from '#imports'

const { locale, locales } = useI18n()
const localePath = useLocalePath()
const isOpen = ref(false)

const availableLocales = computed(() => {
  return locales.value.filter(l => l.code !== locale.value)
})

const currentLocale = computed(() => {
  return locales.value.find(l => l.code === locale.value)
})

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const switchLanguage = (code) => {
  // Close dropdown first
  isOpen.value = false
  
  // Use Nuxt's built-in navigation instead of direct window location change
  const router = useRouter()
  const route = useRoute()
  
  // Get the current route and switch to the same route with new locale
  // Don't set locale.value directly, let the navigation handle it
  router.push(localePath(route.fullPath, code))
}

// Close dropdown when clicking outside
const handleClickOutside = (event) => {
  if (isOpen.value && !event.target.closest('.relative')) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
