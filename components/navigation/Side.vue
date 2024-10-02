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

const tables = mysql.liveQuery('SHOW TABLES;')

console.log(model.value);

</script>

<template>
  <div
    class="border-r border-border min-w-[200px]"
  >
    <div
        class="p-4 border-border border-b"
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
                class="flex flex-col gap-1"
                v-if="tables.message === 'loading'"
            >
                <div 
                    v-for="(_, index) in Array(3)"
                    class="bg-primary/10 h-2.5 w-[130px] rounded-[2px] animate-pulse"
                />
            </div>
            <div
                class="text-sm text-[#A0A4A5] w-full"
                v-if="!tables.data.length"
            >
                No tables found
            </div>
            <div
                :class="cn(
                    'flex gap-2 items-center text-sm text-[#A0A4A5] hover:text-[#e7e7e8] transition-all duration-150 cursor-pointer hover:pl-1',
                    {
                        'text-primary hover:text-primary/80 pl-1': model?.name && model.name === table.Tables_in_tables
                    }
                )"
                v-if="tables.data"
                v-for="table of tables.data"
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
                    'text-sm flex gap-2 items-center text-[#A0A4A5] cursor-pointer hover:text-[#e7e7e8] transition-all duration-150 hover:pl-1',
                    {
                        'text-primary hover:text-primary/80 pl-1': query.name === model?.name
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
                    class="max-w-[135px] overflow-hidden [#e7e7e8]space-nowrap text-nowrap text-ellipsis"
                >
                    {{ query.name }}
                </p>
            </div>
       </div>
    </div>
  </div>
</template>