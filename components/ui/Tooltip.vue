<script setup lang='ts'>
    const { title } = defineProps<{
        title: string
    }>()
    import { ref } from 'vue' 

    const open = ref(false)
</script>

<template>
    <div
        class='relative'
        @mouseenter="open = true"
        @mouseleave="open = false"
        @touchstart="open = true"
        @touchend="open = false"
    >
        <Transition>
            <p
                class="absolute -top-2 left-2/4 -translate-x-2/4 -translate-y-full whitespace-nowrap bg-[#1b1c21] border-white/20 border text-white text-sm px-2 py-1 rounded font-medium"
                v-if="open"
            >
                {{ title }}
            </p>
        </Transition>
        <slot />
    </div>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.3s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>