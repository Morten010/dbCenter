<script setup lang="ts">
const containers = await useDocker.getAllContainers()

</script>

<template>
  <div>
    <h1>
      Containers
    </h1>
    
    <div>
      <div
        v-for="container in containers"
      >
        {{ container.Names[0].replace('/', '') }}
      </div>
    </div>
  </div>
</template>
