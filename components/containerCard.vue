<script setup lang="ts">
import type Dockerode from 'dockerode';
import { toast } from 'vue-sonner';

const loading = ref(false)

const { container } = defineProps<{
  container: Dockerode.ContainerInfo
}>()

const handleStartContainer = async () => {
  loading.value = true
  
  
  if(container.State !== 'running') {
    const res: {
      message: string,
      success: boolean
    } = await useDocker.startContainer(container.Id)

    if(!res.success) return toast.error(res.message)

    toast.success('Database is starting up🚀')
    loading.value = false
    return
  }
  if(container.State === 'running') {
    const res: {
      message: string,
      success: boolean
    } = await useDocker.stopContainer(container.Id)

    if(!res.success) return toast.error(res.message)

    toast.success('Database is shutting down🛬')
    loading.value = false
    return
  }
}
</script>

<template>
  <div class="flex flex-col py-[10px] px-[20px] border border-[#1D1E24] rounded-[8px] gap-[14px] relative">

    <!-- top -->
     <div
      class="flex gap-5 items-center"
     >
        <Icon name="devicon:mysql" size="38" />
        <div>
          <h2
            class="font-semibold"
          >
            {{ container.Names[0].replace('/', '') }}
          </h2>
          <p
            class="text-sm text-[#8C8E98]"
          >
            Mysql 9.x.x @ 3306
          </p>
        </div>

        <div
          class="self-center ml-auto"
        >
          <div
            class="relative"
          >
            <div 
              :class="cn(
                'bg-red-600 w-1.5 h-1.5 rounded-full animate-ping transition-colors duration-200',
                {
                  'bg-green-600': container.State === 'running',
                  'bg-yellow-500': loading
                }
              )"
            />
            <div 
              :class="cn(
                'bg-red-600 w-1.5 h-1.5 rounded-full absolute left-0 top-0 transition-colors duration-200',
                {
                  'bg-green-600': container.State === 'running',
                  'bg-yellow-500': loading
                }
              )"
            />
          </div>
        </div>
     </div>
    <!-- top -->

    <!-- bottom -->
    <div
      class="flex gap-1 items-center justify-end"
    >
      <!-- editor button -->
       <UiTooltip
        title="Coming soon"
       >
        <button 
            class="text-[#8C8E98] opacity-50 cursor-not-allowed"
            disabled
          >
            <Icon 
              name="ri:database-line"
              size="20" 
            />
          </button>
       </UiTooltip>
      <!-- editor button -->
      <!-- start button -->
      <UiTooltip
        :title="loading ? 'Loading...' : container.State === 'running' ? 'Shutdown database' : 'Start database'"
      >
        <button 
          class="text-[#8C8E98] hover:text-white"
          @click="handleStartContainer"
          :disabled="loading"
        >
          <Icon 
            name="solar:play-linear" 
            size="20" 
            v-if="!loading && container.State !== 'running'"
          />
          <Icon 
            name ="mingcute:pause-line" 
            size="20" 
            v-if="!loading && container.State === 'running'"
          />
          <Icon 
            name="fluent:spinner-ios-20-regular"
            size="20"
            class="animate-spin"
            v-if="loading"
          />
        </button>
      </UiTooltip>
      <!-- start button -->
    </div>
    <!-- bottom -->
  </div>
</template>
