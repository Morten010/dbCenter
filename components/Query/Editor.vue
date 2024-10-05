<script setup lang='ts'>
import { sql, type SQLConfig } from "@codemirror/lang-sql";
import { Codemirror } from 'vue-codemirror';
import { toast } from 'vue-sonner';
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

const tableResponse = ref<null | {
    data: any;
    fields: any;
    new: boolean;
}>(null)
const code = ref<string>(query || '')
const loading = ref<boolean>(false)
const messages = ref<{
  message: string
  time?: number
  // add more later if needed
}[]>([])
const tab = ref<'query' | 'result'>('query')

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
  if(!code.value.length) return toast.error('Missing query to execute');
  
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
  if(res.success){
    res.fields
    res.data
    console.log(res.fields);
    console.log(res.data);
    
    tableResponse.value = {
      data: res.data,
      fields: res.fields,
      new: true
    }
  }
  
  loading.value = false;
}

function handleKeydown(event: KeyboardEvent) {
  if (event.shiftKey && event.key === 'Enter') {
    handleRunQuery();
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
});

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
      :class="cn(
        'bottom-0 right-0 h-[200px] max-h-[200px] max-w-[calc(100vw-200px)] overflow-auto border-t w-full border-border flex flex-col',
      )"
      v-if="messages.length"
    >
      <div
        class="border-b border-border flex bg-primary/5 "
      >
        <div
          class="border-r border-border  py-1 px-4 cursor-pointer hover:bg-primary/10 hover:text-primary transition-all duration-100 font-medium"
          @click="tab = 'query'"
        >
          Query
        </div>
        <div
          class="border-r border-border  py-1 px-4 cursor-pointer hover:bg-primary/10 hover:text-primary transition-all duration-100 font-medium"
          @click="tab = 'result'"
        >
          Result
        </div>
      </div>
      <QueryMessages 
        :messages="messages"
        v-if="tab === 'query'"
      />
      <div
        class="max-w-[calc(100vw-200px)] max-h-[calc(200px-33.5px)] min-h-[calc(200px-33.5px)] overflow-auto"
        v-if="tab === 'result'"
      >
        <QueryTable 
          :columns="tableResponse?.fields"
          :rows="tableResponse?.data"
          v-if="tab === 'result'"
        />
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
          'bg-primary text-bg font-semibold px-3 py-1.5 rounded flex gap-2 items-center',
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