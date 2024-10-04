<script setup lang='ts'>
const open = ref<boolean>(false)

const choice = defineModel<{
    title: string;
    value: string;
} | null>()

const {
    versions
} = defineProps<{
    versions: {
        title: string;
        value: string;
    }[]
}>()

const handleChooseVersion = (version: {
    title: string,
    value: string
}) => {
    choice.value = version
    open.value = false
}

</script>

<template>
    <div
        class="relative"
    >
        <div
            :class="cn(
                'border-border border p-2 rounded-lg flex items-center justify-between hover:ring-primary/5 ring-1 ring-transparent transition-all duration-100 cursor-pointer',
                {
                    'ring-primary/20 hover:ring-primary/20': open
                }
            )"
            @click="open = !open"
        >
            <p>
                {{ choice ? `v${choice.title}` : 'Pick a version' }}
            </p>

            <Icon 
                :name="open ? 'jam:chevron-up' : 'jam:chevron-down'" 
                class="mt-1"
            />
        </div>
        
        <div
            class="absolute w-full -bottom-1.5 translate-y-full bg-modal-bg border-border border rounded-lg overflow-hidden"
            v-if="open"
        >
            <div
                class="p-2 hover:bg-primary/[2%] transition-colors duration-100 cursor-pointer"
                v-for="version of versions"
                @click="() => handleChooseVersion(version)"
            >
                Version {{ version.title }}
            </div>
        </div>
    </div>
</template>