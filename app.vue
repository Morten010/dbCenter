<script setup lang="ts">
import { Toaster } from 'vue-sonner'
import { useDbStore } from './store/dbStore';

const status = ref<'loading' | 'error' | 'success'>('loading')

const checkConnection = async () => {
  const checkConnection = await useDocker.checkConnection()

  if(checkConnection) return status.value = 'success'

  status.value = 'error'
}

setInterval(() => {
    checkConnection()
}, 1000) as unknown as number

</script>

<template>
  <LoadingScreen 
    v-if="status === 'loading'"
  />
  <NuxtPage 
    v-if="status === 'success'"
  />
  <ErrorScreen 
    v-if="status === 'error'"
  />

  <Toaster 
    theme="dark"
    position="top-center"
    rich-colors
  />
</template>
