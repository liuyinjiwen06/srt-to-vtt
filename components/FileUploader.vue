<template>
  <div 
    class="border-2 border-dashed border-purple-500 rounded-lg p-8 text-center hover:border-purple-400 transition-colors"
    :class="{ 'bg-purple-900 bg-opacity-10': isDragging }"
    @dragover.prevent="isDragging = true"
    @dragleave.prevent="isDragging = false"
    @drop.prevent="handleDrop"
  >
    <div v-if="status === 'idle' || status === 'error'">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-purple-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
      </svg>
      <p class="text-xl mb-4">{{ $t('home.dropzone') }}</p>
      <input 
        type="file" 
        ref="fileInput" 
        @change="handleFileChange" 
        accept=".srt" 
        class="hidden" 
      />
      <button 
        @click="$refs.fileInput.click()" 
        class="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
      >
        {{ $t('home.convert') }}
      </button>
      <p v-if="selectedFile" class="mt-4 text-gray-300">
        {{ selectedFile.name }}
      </p>
    </div>
    
    <div v-else-if="status === 'processing'" class="py-8">
      <div class="loader"></div>
      <p class="mt-4 text-xl">{{ $t('home.processing') }}</p>
    </div>
    
    <div v-else-if="status === 'success'" class="py-8">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-green-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
      </svg>
      <p class="text-xl text-green-500">{{ $t('home.success') }}</p>
      <p class="mt-2 text-gray-300">{{ selectedFile?.name }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits, defineProps } from 'vue'
import { useI18n } from '#imports'

const props = defineProps({
  status: {
    type: String,
    default: 'idle'
  }
})

const emit = defineEmits(['file-selected', 'conversion-error'])
const { t } = useI18n()

const fileInput = ref(null)
const selectedFile = ref(null)
const isDragging = ref(false)

const handleFileChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    processFile(file)
  }
}

const handleDrop = (event) => {
  isDragging.value = false
  const file = event.dataTransfer.files[0]
  if (file) {
    processFile(file)
  }
}

const processFile = (file) => {
  selectedFile.value = file
  
  // Check if it's an SRT file
  if (!file.name.toLowerCase().endsWith('.srt')) {
    emit('conversion-error', t('home.invalidFile'))
    return
  }
  
  // Read and convert the file
  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      emit('file-selected', {
        vtt: convertSrtToVtt(e.target.result),
        fileName: file.name
      })
    } catch (error) {
      emit('conversion-error', error.message || t('home.error'))
    }
  }
  reader.onerror = () => {
    emit('conversion-error', t('home.error'))
  }
  reader.readAsText(file)
}

const convertSrtToVtt = (srtContent) => {
  // Add VTT header
  let vttContent = 'WEBVTT\n\n'
  
  // Process SRT content
  const lines = srtContent.split(/\r?\n/)
  let i = 0
  
  while (i < lines.length) {
    // Skip empty lines and subtitle numbers
    if (lines[i].trim() === '') {
      i++
      continue
    }
    
    // Skip the subtitle number (which is just a counter)
    if (/^\d+$/.test(lines[i].trim())) {
      i++
      continue
    }
    
    // Process timestamp line
    const timestampLine = lines[i]
    if (timestampLine.includes('-->')) {
      // Convert SRT timestamp format (00:00:00,000) to VTT format (00:00:00.000)
      const vttTimestamp = timestampLine.replace(/,/g, '.')
      vttContent += vttTimestamp + '\n'
      i++
      
      // Add all text lines until the next empty line
      while (i < lines.length && lines[i].trim() !== '') {
        vttContent += lines[i] + '\n'
        i++
      }
      
      // Add an extra newline between entries
      vttContent += '\n'
    } else {
      // If we encounter an unexpected format, just skip the line
      i++
    }
  }
  
  return vttContent
}
</script>

<style scoped>
.loader {
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top: 4px solid #a855f7;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 0 auto;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
