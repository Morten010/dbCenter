
<script setup>
import { ref, onMounted } from 'vue'
import { VueFlow, Panel } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
const nodes = ref([
  {
    id: '1',
    position: { x: 50, y: 50 },
    data: { label: 'Node 1', },
  }
]);

function addNode() {
  const id = Date.now().toString()
  
  nodes.value.push({
    id,
    position: { x: 150, y: 50 },
    data: { label: `Node ${id}`, },
  })
}
</script>

<template>
    <VueFlow 
        :nodes="nodes"
        class="max-w-[calc(100vw-200px)] overflow-hidden max-h-[calc(100vh-57px)] h-full"
    >
        <Background />
    </VueFlow>
</template>