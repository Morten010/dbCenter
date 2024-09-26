<script setup lang="ts">
const status = ref<'loading' | 'error' | 'success'>('loading')

const checkConnection = async () => {
  const checkConnection = await useDocker.checkConnection()
  console.log(checkConnection);

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
</template>
