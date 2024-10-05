<script setup lang='ts'>
const mysql = await useMysql()

const emit = defineEmits<{
    (event: 'pick', tableName: string): void 
}>()

const tables = mysql.liveQuery('show tables;')

const handleClick = (tableName: string) => {
    emit('pick', tableName)
}
</script>

<template>
  <div
    class="p-4"
  >
    <h2
        class="text-3xl font-semibold"
    >
        Tables
    </h2>
    <p
        class="text-[#e7e7e8]/60"
    >
        Pick a table to view.
    </p>
    <div
        class="pt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 xl:grid-cols-4 2xl:grid-cols-5"
    >
        <div
            v-for="table in tables.data"
            class="rounded-lg overflow-hidden w-full border-border border bg-modal-bg group hover:border-primary/60 cursor-pointer transition-all duration-100 shadow-md"
            @click="() => handleClick(table.Tables_in_tables)"
        >
            <div
                class="aspect-video border-b border-border flex items-center justify-center relative"
            >
                <img
                    src="/table.jpg"
                    class="absolute h-full top-0 left-0 w-full"
                />
            </div>
            <p
                class="p-2 group-hover:pl-3 group-hover:text-primary transition-all duration-100 capitalize"
            >
                {{ table.Tables_in_tables }} table
            </p>
        </div>
    </div>
  </div>
</template>