<script setup lang='ts'>
import { toast } from 'vue-sonner'
import { useDbStore } from '~/store/dbStore';
const open = ref(false)
const loading = ref(false)
const dbFormData = reactive({
    databaseName: "",
    databasePort: 3306,
    databasePassword: 'mypassword',
    databaseUser: 'admin'
})

const useDb = useDbStore()

const handleSubmit = async (e: Event) => {
    e.preventDefault()
    const exists = [...useDb.allDatabases].find(db => db.name === dbFormData.databaseName)
    const portInUse =  [...useDb.allDatabases].find(db => db.port === dbFormData.databasePort.toString() && db.status === 'on' || db.status === 'loading')

    if(!loading) return
    if(exists) return toast.error(`A database is already named ${dbFormData.databaseName}`)
    if(portInUse) return toast.error(`The database port is already in use please close the database using the port to create the database.`)
    if(!dbFormData.databaseName.length) return toast.error('Missing database name')
    if(!dbFormData.databasePassword.length) return toast.error('Missing password')
    if(dbFormData.databasePort.toString().length !== 4) return toast.error('Port must be 4 numbers, 3306 is suggested.')
    if(!dbFormData.databaseUser.length) return toast.error('Missing user')
    loading.value = true



    const res = await useDb.addDatabase(dbFormData)
    console.log(res);
    

    loading.value = false
    if(res) return open.value = false
}


</script>

<template>
    <button
        class="fixed bottom-5 right-5 grid place-content-center bg-primary hover:bg-primary/80 rounded-full p-1 text-bg transition-colors duration-100"
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
                    class="flex justify-end gap-2 mt-2 border-t border-border pt-4 px-4"
                >
                    <button
                        type="button"
                        :class="cn(
                            'bg-[#6e190e] py-2 px-4 rounded font-semibold transition-all duration-100',
                            {
                                'opacity-60 cursor-not-allowed': loading
                            }
                        )"
                        @click="open = false"
                        :disabled="loading"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        :class="cn(
                            'bg-primary py-2 px-4 text-modal-bg rounded font-bold',
                            {
                                'opacity-60 cursor-not-allowed': loading
                            }
                        )"
                        :disabled="loading"
                    >
                        <Icon 
                            name="fluent:spinner-ios-20-regular" 
                            class="animate-spin" 
                            v-if="loading"
                        />
                        {{ loading ? 'Setting up database' : 'Create'}}
                    </button>
                </div>
            </form>
        </UiDialogBody>
    </UiDialog>
</template>