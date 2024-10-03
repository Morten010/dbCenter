<script setup lang="ts">
import { toast } from 'vue-sonner';
import { useDbStore } from '~/store/dbStore';
const update = ref<{
  message: string,
  success: boolean
}>({
  message: 'loading',
  success: false
})

const dbStore = useDbStore()

const handleCheckForUpdate = async () => {
  const {
    message,
    success,
  } = await useUpdate.check()

  update.value = {
    message,
    success
  }
}

handleCheckForUpdate()

const updatePromise = () => {
  return new Promise(async (resolve, reject) => {
    const res = await useUpdate.run()
    
    if(res.success) {
      reject(res.message)
    }

    resolve(res.message)
  })
}

const handleUpdate = () => {
  toast.promise(updatePromise(), {
    loading: 'Downloading update',
    success: () => {
      return 'Updating and restarting the app now'
    },
    error: () => {
      return 'Failed to download update'
    }
  })
}

</script>


<!-- homepage -->
<template>
  <div
    class="bg-primary text-bg font-semibold text-center py-1"
    v-if="update.success"
  >
    {{ update.message }} <span 
    class="font-bold cursor-pointer"
    @click="() => handleUpdate()"
    >Download Now</span> 
  </div>
  <div 
    class="w-full flex flex-col px-5 bg-bg min-h-screen text-[#e7e7e8] max-w-[100vw] overflow-hidden"
  >
    <div
      class="flex flex-col my-4 text-center"
    >
      <img
        src="/large-logo.png"
        width="297"
        height="41"
        class="mx-auto"
      />
      <p
        class="text-[#8C8E98] text-sm tracking-wide"
      >
        Manage your MySQL databases with ease
      </p>
    </div>

    <div
      class="grid grid-cols-2 gap-4"
      v-if="!!dbStore.allDatabases.length"
    >
      <ContainerCard 
        v-for="database in dbStore.allDatabases"
        :database="database"
      />
    </div>
    <div
      v-if="!dbStore.allDatabases.length"
      class="my-20"
    >
      <img 
        src="/missing.png"
        width="200"
        height="200"
        class="mx-auto"
      />
      <h2
        class="text-xl text-center"
      >
        No Databases found
      </h2>
      <p
        class="text-[#8C8E98] text-center"
      >
        Create a database to begin
      </p>
    </div>

    <CreateDatabase />
  </div>
</template>
