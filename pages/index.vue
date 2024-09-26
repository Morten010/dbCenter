<script setup lang="ts">
const containers = await useDocker.getAllContainers();
</script>

<!-- homepage -->
<template>
  <div 
    class="w-full flex p-2"
>
    <h1 
        class="text-2xl font-semibold"
    >
        Databases
    </h1>

    <div>
      <div v-for="container in containers">
        {{ container.Names[0].replace("/", "") }}
      </div>
    </div>

    <button
        class="fixed bottom-2 right-2 border grid place-content-center rounded hover:opacity-80"
    >
        <Icon 
            name="iconoir:plus" 
            size="28"
        />
    </button>
  </div>
</template>
