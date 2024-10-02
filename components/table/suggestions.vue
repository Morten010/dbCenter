<script setup lang='ts'>
const mysql = await useMysql()

const emit = defineEmits<{
    (event: 'pick', tableName: string): void 
}>()

const {
    data
} = await mysql.query('show tables;')

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
        class="pt-4 flex gap-x-4 gap-y-3 flex-wrap"
    >
        <div
            v-for="table in data"
            class="rounded-lg overflow-hidden max-w-[200px] w-full min-w-[250px] border-border border bg-modal-bg group hover:border-primary/60 cursor-pointer transition-all duration-100 shadow-md"
            @click="() => handleClick(table.Tables_in_tables)"
        >
            <div
                class="aspect-video border-b border-border flex items-center justify-center relative"
            >
                <NuxtImg 
                    fill
                    src="/table.jpg"
                    class="top-0 left-0 w-full"
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