<script setup lang='ts'>
defineProps<{
    messages: {
      message: string
      time?: number
      // add more later if needed
    }[]
}>()
</script>

<template>
    <div
      class="h-[200px] max-h-[200px]"
    >
      <div
        v-for="(msg, index) in [...messages].reverse()"
        :class="cn(
          'text-sm p-2 border-b border-border text-[#a0a4a5] flex justify-between'
        )"
      >
        <p>
            {{ messages.length - index }}. {{ msg.message }}
        </p>
        <p
          v-if="msg?.time"
        >
          {{ msg.time?.toFixed(2) }} ms
        </p>
      </div>
    </div>
</template>