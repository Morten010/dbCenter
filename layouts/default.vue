<script setup lang='ts'>
import type Dockerode from 'dockerode';
import { useDbStore } from '~/store/dbStore';

const useDb = useDbStore()
const dbNames = useDb.allDatabasesNames
const status = ref<'loading' | 'error' | 'success'>('loading')


const sync = async () => {
  const volumes = await useDocker.syncMysql()

  const dbCenterVolumes: Dockerode.VolumeInspectInfo[] = []
  const volumeDoNotExist: string[] = []

  // find all volumes with connected with app
  for(const volume of volumes.Volumes){
    if(volume.Name.includes('DatabaseCenter')) {
      dbCenterVolumes.push(volume)
    }
  }

  // check what volumes already exists
  for(const volume of dbCenterVolumes){
    if(!dbNames.includes(volume.Name)){
      await useDb.addExistingDatabase(volume.Name)
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