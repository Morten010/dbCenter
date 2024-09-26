<script setup lang='ts'>
const open = defineModel<boolean>()

</script>

<template>
    <!-- backdrop -->
    <div
        v-if="open"
        @click="open = false"
        class="bg-black/10 w-screen h-screen backdrop-blur-sm fixed top-0 left-0 grid place-content-center"
    >
        <!-- dialog -->
        <div
            class="border border-[#1D1E24] rounded-[8px] bg-[#101014] min-w-[350px]"
            @click="(e) => e.stopPropagation()"
        >
            <slot />
        </div>
        <!-- dialog -->
    </div>
    <!-- backdrop -->
</template>