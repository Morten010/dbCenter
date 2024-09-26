<script setup lang="ts">
import type Dockerode from 'dockerode';

const containers = ref<Dockerode.ContainerInfo[]>([])

const getContainers = async () => {
  containers.value = await useDocker.getAllContainers();
}

console.log(containers);

onBeforeMount(() => {
  getContainers()  
})

let intervalId:  NodeJS.Timeout | string | number | undefined;

onMounted(() => {
  intervalId = setInterval(() => {
    getContainers()
  }, 1000) as unknown as number
})

onUnmounted(() => {
  clearInterval(intervalId)
})
</script>

<!-- homepage -->
<template>
  <div 
    class="w-full flex flex-col px-5 bg-[#101014] min-h-screen text-white max-w-[100vw] overflow-hidden"
>
    <div
      class="text-center mt-5 mb-7"
    >
      <div
        class="flex items-center justify-center gap-1"
      >
        <img 
          src="/icon.svg"
        />
        <h1 
          class="text-4xl font-medium mb-1"
        >
        Database Center
        </h1>
      </div>
      <p
        class="text-[#8C8E98]"
      >
        Manage your MySQL databases with ease
      </p>
    </div>

    <div
      class="grid grid-cols-2 gap-4"
      v-if="!!containers.length"
    >
      <ContainerCard 
        v-for="container in containers"
        :container="container"
      />
    </div>
    <div
      v-if="!containers.length"
      class="my-10"
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
