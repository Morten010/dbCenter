<script setup lang='ts'>
const open = defineModel<boolean>()

const {
    disableBackdropClose = false
} = defineProps<{
    disableBackdropClose?: boolean
}>()

const handleClose = () => {
    if(!disableBackdropClose){
        open.value = false
    }
}

</script>

<template>
    <!-- backdrop -->
    <div
        v-if="open"
        @click="handleClose"
        class="bg-black/10 w-screen h-screen backdrop-blur-sm fixed top-0 left-0 grid place-content-center"
    >
        <!-- dialog -->
        <div
            class="border border-border rounded-[8px] bg-modal-bg min-w-[350px]"
            @click="(e) => e.stopPropagation()"
        >
            <slot />
        </div>
        <!-- dialog -->
    </div>
    <!-- backdrop -->
</template>