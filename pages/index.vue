<template>
  <div class="min-h-screen flex flex-col bg-[#03000F] text-white">
    <header class="container mx-auto p-4 flex justify-between items-center">
      <h1 class="text-2xl font-bold">{{ $t('app.title') }}</h1>
      <LanguageSwitcher />
    </header>
    
    <main class="container mx-auto flex-grow flex flex-col items-center justify-center p-4">
      <h2 class="text-4xl font-bold mb-2 text-center">{{ $t('home.title') }}</h2>
      <p class="text-xl mb-8 text-center text-gray-300">{{ $t('home.subtitle') }}</p>
      
      <div class="w-full max-w-2xl">
        <FileUploader 
          @file-selected="handleFileSelected" 
          @conversion-error="handleError"
          :status="status"
        />
        
        <div v-if="status === 'success'" class="mt-6 flex justify-center">
          <button 
            @click="downloadVtt" 
            class="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 flex items-center"
          >
            <span>{{ $t('home.download') }}</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L10 12.586l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
        
        <div v-if="errorMessage" class="mt-4 text-red-500 text-center">
          {{ errorMessage }}
        </div>
      </div>
    </main>
    
    <footer class="container mx-auto p-4 text-center text-gray-400">
      <p>{{ $t('footer.copyright') }}</p>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useHead, useI18n } from '#imports'
import LanguageSwitcher from '~/components/LanguageSwitcher.vue'

const { t, locale } = useI18n()

// Update page metadata for SEO
useHead(() => ({
  title: t('app.title'),
  meta: [
    {
      name: 'description',
      content: t('app.description')
    },
    {
      property: 'og:title',
      content: t('app.title')
    },
    {
      property: 'og:description',
      content: t('app.description')
    },
    {
      name: 'twitter:title',
      content: t('app.title')
    },
    {
      name: 'twitter:description',
      content: t('app.description')
    },
    {
      property: 'og:locale',
      content: locale.value === 'zh' ? 'zh_CN' : 'en_US'
    }
  ]
}))

const status = ref('idle') // idle, processing, success, error
const vttContent = ref('')
const errorMessage = ref('')
const fileName = ref('')

const handleFileSelected = (result) => {
  vttContent.value = result.vtt
  fileName.value = result.fileName.replace('.srt', '.vtt')
  status.value = 'success'
  errorMessage.value = ''
}

const handleError = (error) => {
  status.value = 'error'
  errorMessage.value = error
}

const downloadVtt = () => {
  const blob = new Blob([vttContent.value], { type: 'text/vtt' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = fileName.value
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
</script>
