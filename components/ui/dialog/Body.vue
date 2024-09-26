<script setup lang='ts'>
const props = defineProps<{
  class: string
}>()
</script>

<template>
  <div
    :class="cn(
      'px-4 py-3 w-full',
      props.class
    )"
  >
    <slot />
  </div>
</template>