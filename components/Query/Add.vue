<script setup lang='ts'>
import { toast } from 'vue-sonner';
import { useDbStore } from '~/store/dbStore';

const {
    params
} = useRoute()
const useDb = useDbStore()
const open = ref<boolean>()
const name = ref<string>('')

const {
    disabled,
    query
} = defineProps<{
    disabled: boolean;
    query: string
}>()

const handleSubmitForm = (e: Event) => {
    e.preventDefault()
    const finalName = name.value.trim()

    if(!finalName.length) return toast.error('Missing name for query') 
    if(!query.trim().length) return toast.error('Query is missing') 
    if(!params.id) return toast.error('Failed to get database') 
    
    useDb.addQuery({
        name: name.value,
        query,
        volumeId: params.id as string
    })
    
    open.value = false;
    name.value = ''

    toast.success('Successfully added query')
}

</script>

<template>
  <button
        :class="cn(
          'bg-[#191a1e] text-[#5a5d67] px-3 py-1.5 rounded flex gap-2 items-center hover:text-[#526FDF] hover:bg-[#141A39] transition-colors duration-100',
          {
            'opacity-60 cursor-not-allowed': disabled
          }
        )"
        :disabled="disabled"
        @click="open = true"
    >
        <Icon name="lucide:save"/>
        Save Query
    </button>
    <UiDialog
        v-model="open"
    >
        <UiDialogHead>
            <h2
                class="font-semibold"
            >
                Save query
            </h2>
        </UiDialogHead>
        <UiDialogBody
            class="px-0"
        >
            <form
                class="flex flex-col gap-2"
                @submit="handleSubmitForm"
            >
                <label
                    class="flex flex-col gap-1 px-4"
                >
                    <span>
                        Query name
                    </span>
                    <UiInput
                        type="text"
                        placeholder="All users"
                        class="w-full"
                        v-model="name"
                    />
                </label>
                <div
                    class="flex justify-end gap-2 mt-2 border-t border-[#1D1E24] pt-4 px-4"
                >
                    <button
                        type="button"
                        :class="cn(
                            'bg-[#6e190e] py-2 px-4 rounded font-semibold',
                            {
                                'opacity-60 cursor-not-allowed': !name.length
                            }
                        )"
                        :disabled="!name.length"
                        @click="open = false"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        :class="cn(
                            'bg-[#465ED6] py-2 px-4 rounded font-semibold',
                            {
                                'opacity-60 cursor-not-allowed': !name.length
                            }
                        )"
                        :disabled="!name.length"
                    >
                        Save
                    </button>
                </div>
            </form>
        </UiDialogBody>
    </UiDialog>
</template>