<script setup lang='ts'>
import type Dockerode from 'dockerode';
import { toast } from 'vue-sonner';
import { deleteMysqlDatabase } from '~/electron/docker/DeleteMysqlDatabase';
import { useDbStore } from '~/store/dbStore';

const useDb = useDbStore()
const dbNames = useDb.allDatabasesNames
const status = ref<'loading' | 'error' | 'success'>('loading')


const sync = async () => {
  const dockerVolumes = await useDocker.allVolumes()
  const savedVolumes = useDb.allDatabasesNames
  const volumes: string[] = [
    ...dockerVolumes, 
    ...savedVolumes.filter(vol => !dockerVolumes.includes(vol))
  ]
  console.error('syncing');
  console.log(volumes);
  
  // check what volumes already exists
  console.log('volumes: '+volumes.length);
  
  for(const volume of volumes){
    if(!dbNames.includes(volume)){
      // Add db to list
      await useDb.addExistingDatabase(volume)
    }else{
      // check if status matches stored status
      const res = await useDocker.sync(volume)

      switch (res) {
        case 'VOLUME_DELETED':
          useDb.deleteMissingDb(volume)
          toast.error('Deleted missing datbase', {
            description: 'Database missing from docker so it has been removed'
          })    
          break;
        case 'OFF':
          console.log('Volume is off');
          const dbOFF = useDb.getSpecificContainer(volume)

          if(!dbOFF) return

          useDb.updateDatabase({
            ...dbOFF,
            status: 'off'
          })
          break
        case 'ON':
          console.log('Volume is on');
          const dbON = useDb.getSpecificContainer(volume)

          if(!dbON) return

          useDb.updateDatabase({
            ...dbON,
            status: 'on'
          })
          break

        default:
          break;
      }
      
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