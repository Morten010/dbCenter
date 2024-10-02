<script setup lang='ts'>
import { Codemirror } from 'vue-codemirror';
import { sql, type SQLConfig } from "@codemirror/lang-sql"
import { useDbStore } from '~/store/dbStore';

const {
    queryName
} = defineProps<{
    queryName: string
}>()
const {
    params: {
        id
    }
} = useRoute()
const useDb = useDbStore()
const query = useDb.getQuery(queryName, id as string)
console.log(`Query: ${query}`);
console.log(`Query name: ${queryName}`);

const code = ref<string>(query || '')
const loading = ref<boolean>(false)
const messages = ref<{
  message: string
  time?: number
  // add more later if needed
}[]>([])

const mysql = await useMysql()

const res = await mysql.query('show tables;')
const data: null | {
  Tables_in_tables: string
}[] = res.data

const sqlConfig: SQLConfig = {
  tables: data ? data.map(table => ({
    label: table.Tables_in_tables,
    displayLabel: table.Tables_in_tables,

  })) :  [],

}

const handleRunQuery = async () => {
  loading.value = true;

  messages.value = [...messages.value, 
    {
      message: 'Starting query'
    }
  ]
  const first = performance.now()
  const res = await mysql.query(code.value)
  const second = performance.now()

  messages.value = [...messages.value, 
    {
      message: res.success ? res.message : res.error as string,
      time: second - first
    }
  ]
  
  loading.value = false;
}

</script>

<template>
  <div
    class="flex-grow relative h-full flex flex-col justify-between"
  >
    <div
      class="max-h-[calc(100vh-260px)] overflow-auto"
    >
      <codemirror 
        v-model="code"
        placeholder="Sql query here"
        :indent-with-tab="true"
        :tab-size="2"
        lang="sql"
        :extensions="[
          sql(sqlConfig),
          dbCenterQueryTheme
        ]"
      />
    </div>

    <!-- query info screen -->
    <div
      class="bottom-0 right-0 h-[30%] max-h-[300px] overflow-auto max-w-[calc(100vw-200px)] border-t w-full border-border "
    >
      <div
        v-for="(msg, index) in [...messages].reverse()"
        :class="cn(
          'text-sm p-2 border-b border-border text-[#a0a4a5] flex justify-between'
        )"
      >
        <p>
            {{ messages.length - index }}. {{ msg.message }}
        </p>
        <p
          v-if="msg?.time"
        >
          {{ msg.time?.toFixed(2) }} ms
        </p>
      </div>
    </div>
    <!-- query info screen -->

    <div
      class="absolute bottom-3 right-3 flex gap-2"
    >
      <QueryAdd 
        :disabled="loading || !code.length"
        :query="code"
      />
      <button
        :class="cn(
          'bg-[#465ED6] px-3 py-1.5 rounded flex gap-2 items-center',
          {
            'opacity-60 cursor-not-allowed': loading
          }
        )"
        @click="handleRunQuery"
        :disabled="loading"
      >
        <Icon name="solar:play-linear"/>
        Run query
      </button>
    </div>
  </div>
</template>