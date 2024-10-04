<script setup lang='ts'>
import { toast } from 'vue-sonner'
import { databaseChoicesConst, databaseVersionConst } from '~/constants';
import * as v from 'valibot';
import { useDbStore } from '~/store/dbStore';

const useDb = useDbStore()
const open = ref(false)
const loading = ref(false)
const dbFormData = reactive({
    databaseName: "",
    databasePort: 3306,
    databasePassword: 'mypassword',
    databaseUser: 'admin',
    database: '',
    version: null
})

const formSchema = v.object({
    databaseName: v.pipe(
        v.string('Must have a name for the database.'),
        v.nonEmpty("Please enter a name for you're database,")
    ),
    databasePort: v.pipe(
        v.string('Port must be a string.'),
        v.nonEmpty('Please enter a port 4 characters long like 3306.'),
        v.minLength(4, 'Port has to be 4 numbers long.')
    ),
    databasePassword: v.pipe(
        v.string('Password must be a string.'),
        v.nonEmpty('Please enter a password.')
    ),
    databaseUser: v.pipe(
        v.string('User must be a string.'),
        v.nonEmpty('Please enter a user.')
    ),
    database: v.pipe(
        v.string('Please pick a database'),
        v.nonEmpty('Database cannot be empty')
    ),
    version: v.nonNullable(v.object({
        title: v.pipe(
            v.string('Missing version'),
            v.nonEmpty('Missing version')
        ),
        value: v.pipe(
            v.string('Missing version'),
            v.nonEmpty('Missing version')
        )
    }), 'Must pick a version of the database to continue'),
})

const handleSubmit = async (e: Event) => {
    e.preventDefault()

    const val = v.safeParse(formSchema, {
        ...dbFormData,
        databasePort: dbFormData.databasePort.toString()
    });
    console.log(val);
    

    if(!val.success) return toast.error(val.issues[0].message)
    loading.value = true

    const res = await useDb.addDatabase(val.output)
    
    loading.value = false
    if(res){
        open.value = false
    }
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
        :disable-backdrop-close="loading"
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
                <!-- database name -->
                <label
                    class="flex flex-col gap-1 px-4"
                >
                    <UiInput
                        type="text"
                        placeholder="Name"
                        class="w-full min-w-[405.33px]"
                        v-model="dbFormData.databaseName"
                    />
                </label>
                <!-- database name -->

                <div
                    class="px-4 py-1 flex gap-2"
                >
                    <CreateDbCard 
                        v-model="dbFormData.database"
                        v-for="db in databaseChoicesConst"
                        :icon="db.icon"
                        :name="db.name"
                        @clear-versions="dbFormData.version = null"
                    />
                </div>

                <div
                    class="px-4"
                    v-if="dbFormData.database"
                >
                    <CreateVersionDropdown 
                        v-model="dbFormData.version"
                        :versions="databaseVersionConst[dbFormData.database as 'mysql']"
                    />
                    <div
                        class="flex gap-2 pt-3"
                    >
                        <UiInput
                            type="text"
                            placeholder="user"
                            class="w-full"
                            v-model="dbFormData.databaseUser"
                        />
                        <UiInput
                            type="text"
                            placeholder="password"
                            class="w-full"
                            v-model="dbFormData.databasePassword"
                        />
                    </div>
                    <UiInput
                        type="number"
                        placeholder="port"
                        class="w-full mt-3"
                        v-model="dbFormData.databasePort"
                    />
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