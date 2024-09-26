<script setup lang='ts'>
import { toast } from 'vue-sonner'
import { useDbStore } from '~/store/dbStore';
const open = ref(false)
const dbFormData = reactive({
    databaseName: "",
    databasePort: 3306,
    databasePassword: 'mypassword',
    databaseUser: 'admin'
})

const useDb = useDbStore()

const handleSubmit = async (e: Event) => {
    e.preventDefault()
    
    if(!dbFormData.databaseName.length) return toast.error('Missing database name')
    if(!dbFormData.databasePassword.length) return toast.error('Missing password')
    if(dbFormData.databasePort.toString().length !== 4) return toast.error('Port must be 4 numbers, 3306 is suggested.')
    if(!dbFormData.databaseUser.length) return toast.error('Missing user')

    const res = await useDb.addDatabase(dbFormData)

    if(res) return open.value = false 
}


</script>

<template>
    <button
        class="fixed bottom-5 right-5 grid place-content-center bg-[#465ED6] hover:bg-[#3952cf] rounded-full p-1 text-[#101014] transition-colors duration-100"
        @click="open = true"
    >
        <Icon 
            name="lucide:plus" 
            size="24"
        />
    </button>
    <UiDialog
        v-model="open"
    >
        <UiDialogHead>
            <h2
                class="font-semibold"
            >
                Create new database
            </h2>
        </UiDialogHead>
        <UiDialogBody
            class="px-0"
        >
            <form
                class="flex flex-col gap-2"
                @submit="handleSubmit"
            >
                <div
                    class="grid grid-cols-2 gap-4 px-4"
                >
                    <label
                        class="flex flex-col gap-1"
                    >
                        <span>
                            Name
                        </span>
                        <UiInput
                            type="text"
                            placeholder="Name"
                            class="w-full"
                            v-model="dbFormData.databaseName"
                        />
                    </label>
                    <label
                        class="flex flex-col gap-1"
                    >
                        <span>
                            Password
                        </span>
                        <UiInput
                            type="text"
                            placeholder="password"
                            class="w-full"
                            v-model="dbFormData.databasePassword"
                        />
                    </label>
                </div>
                
                <div
                    class="grid grid-cols-2 gap-4 px-4"
                >
                    <label
                        class="flex flex-col gap-1"
                    >
                        <span>
                            Port
                        </span>
                        <UiInput
                            type="number"
                            placeholder="Port (3306)"
                            class="w-full"
                            v-model="dbFormData.databasePort"
                        />
                    </label>

                    <label
                        class="flex flex-col gap-1"
                    >
                        <span>
                            user
                        </span>
                        <UiInput
                            type="text"
                            placeholder="user"
                            class="w-full"
                            v-model="dbFormData.databaseUser"
                        />
                    </label>
                </div>
                <div
                    class="flex justify-end gap-2 mt-2 border-t border-[#1D1E24] pt-4 px-4"
                >
                    <button
                        type="button"
                        class="bg-[#6e190e] py-2 px-4 rounded font-semibold"
                        @click="open = false"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        class="bg-[#465ED6] py-2 px-4 rounded font-semibold"
                    >
                        Create
                    </button>
                </div>
            </form>
        </UiDialogBody>
    </UiDialog>
</template>