<script setup lang='ts'>
import type Dockerode from 'dockerode';
import { useDbStore } from '~/store/dbStore';

const useDb = useDbStore()
const dbNames = useDb.allDatabasesNames
const status = ref<'loading' | 'error' | 'success'>('loading')


const sync = async () => {
  const volumes = await useDocker.allVolumes()
  console.error('syncing');
  console.log(volumes);
  
  // check what volumes already exists
  for(const volume of volumes){
    if(!dbNames.includes(volume)){
      // Add db to list
      // await useDb.addExistingDatabase(volume)
    }else{
      // check if status matches stored status
      useDocker.sync(volume)
    }
  }

}

const checkConnection = async () => {
  const checkConnection = await useDocker.checkConnection()

  if(checkConnection) return status.value = 'success'

  status.value = 'error'
}

setInterval(() => {
    checkConnection()
}, 1000) as unknown as number
onMounted(() => {
  sync()
})
</script>

<template>
   <ErrorScreen 
    v-if="status === 'error'"
  />
  <LoadingScreen 
    v-if="status === 'loading'"
  />
  <slot 
    v-if="status === 'success'"
  />
</template>