<script setup lang='ts'>
import { useDbStore } from '~/store/dbStore';

const mysql = await useMysql()
const useDb = useDbStore()
const { 
    params: {
        id
    }
} = useRoute()
const queries = useDb.allQueries(id as string)
const model = defineModel<null | {
    view: string,
    name: string
}>()

const {
    success,
    data
} = await mysql.query('SHOW TABLES;')

console.log(model.value);

</script>

<template>
  <div
    class="border-r border-[#1D1E24] min-w-[200px]"
  >
    <div
        class="p-4 border-[#1D1E24] border-b"
    >
        <h2
            class="font-semibold mb-2"
        >
            Table Content
        </h2>
        <div
            class="flex flex-col"
        >
            <div
                class="text-sm text-[#4F5052] w-full"
                v-if="!data.length"
            >
                No tables found
            </div>
            <div
                :class="cn(
                    'flex gap-2 items-center text-sm text-[#4F5052] hover:text-white transition-all duration-150 cursor-pointer hover:pl-1',
                    {
                        'text-[#3952cf] pl-1': model?.name && model.name === table.Tables_in_tables
                    }
                )"
                v-if="data"
                v-for="table of data"
                @click="model = {
                    view: 'table',
                    name: table.Tables_in_tables
                }"
            >
                <Icon 
                    name="ic:round-chevron-right" 
                    size="16"
                    class="mt-0.5"
                />
                <p>
                    {{ table.Tables_in_tables }}
                </p>
            </div>
        </div>
    </div>

    <div
        class="p-4"
    >
        <h2
            class="font-semibold mb-2"
        >
            Saved Queries
        </h2>
       <div>
            <div
                :class="cn(
                    'text-sm flex gap-2 items-center text-[#4F5052] cursor-pointer hover:text-white transition-all duration-150 hover:pl-1',
                    {
                        'text-[#3952cf] pl-1': query.name === model?.name
                    }
                )"
                v-for="query in queries"
                @click="model = {
                    name: query.name,
                    view: 'query'
                }"
            >
                <Icon 
                    name="tabler:sql" 
                    size="16"
                    class="mt-0.5"
                />
                <p
                    class="max-w-[135px] overflow-hidden whitespace-nowrap text-ellipsis"
                >
                    {{ query.name }}
                </p>
            </div>
       </div>
    </div>
  </div>
</template>