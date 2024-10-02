<script setup lang='ts'>
import type { HTMLAttributes } from 'vue'

const props = defineProps<{
  defaultValue?: string | number
  modelValue?: string | number
  class?: HTMLAttributes['class']
}>()

const model = defineModel()

</script>

<template>
  <input 
    v-model="model"
    :class="cn(
      'bg-transparent border border-border rounded-[8px] text-base p-2 focus:outline-none focus:outline-offset-8 focus:ring-primary/30 focus:ring-1',
      props.class
    )"
  />
</template>