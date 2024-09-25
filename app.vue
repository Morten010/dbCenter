<script setup lang="ts">
const status = ref("...")


const handleStartContainer = () => {
  const answer = useDocker.startContainer()
  status.value = answer
}
const handleStopContainer = () => {
  const answer =  useDocker.stopContainer()
  status.value = answer
}

const createContainer = async () => {
  console.log("running");
}
</script>

<template>
  <div>
    <h1>
      Containers
    </h1>
    <p>
      {{ status }}
    </p>

    <button
      @click="handleStartContainer"
    >
      Start container
    </button>
    <button
      @click="handleStopContainer"
    >
      Stop container
    </button>
    <br>
    <button
      @click="createContainer"
    >
      Create mysql container
    </button>
  </div>
</template>
