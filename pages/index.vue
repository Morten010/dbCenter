<script setup lang="ts">
const containers = await useDocker.getAllContainers();
</script>

<!-- homepage -->
<template>
  <div 
    class="w-full flex flex-col px-5 bg-[#101014] min-h-screen text-white"
>
    <div
      class="text-center mt-5 mb-7"
    >
      <h1 
          class="text-4xl font-medium mb-1"
      >
          Databases
      </h1>
      <p
        class="text-[#8C8E98]"
      >
        Manage your MySQL databases with ease
      </p>
    </div>

    <div
      class="grid grid-cols-2"
    >
      <div v-for="container in containers">
        {{ container.Names[0].replace("/", "") }}
      </div>
      <ContainerCard />
    </div>

    <button
        class="fixed bottom-5 right-5 grid place-content-center bg-[#465ED6] rounded-full p-1 text-[#101014]"
    >
        <Icon 
            name="lucide:plus" 
            size="24"
        />
    </button>
  </div>
</template>
