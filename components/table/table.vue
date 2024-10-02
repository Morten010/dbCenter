<script setup lang='ts'>
const { name } = defineProps<{
    name: string
}>()
const mysql = await useMysql()

const { 
    data,
    success,
    fields
} = await mysql.query(
    `SELECT * FROM ${name}`
)
const {
    data: clmns,
    success: clmnsSuccess,
    message: clmnsMessage,
    fields: clmnsFields
} = await mysql.query(
    `Show columns from ${name}`
)


</script>

<template>
  <table class="w-full">
    <thead class="w-full bg-modal-bg">
        <tr>
            <th
                v-for="col in clmns"
                :key="col"
                class="py-1.5 px-4 border text-sm border-border [#e7e7e8]space-nowrap text-nowrap bg-modal-bg font-normal"
            >
                {{ col.Field }}
            </th>
        </tr>
    </thead>

    <tbody>
        <tr
            v-for="(row, index) in data"
            :key="index"
            class="outline-transparent hover:outline-primary hover:bg-[#162421] outline outline-1 transition-all duration-150 cursor-pointer"
        >
            <td
                v-for="col in clmns"
                :key="col"
                class="text-sm py-1.5 px-4 border border-border [#e7e7e8]space-nowrap text-nowrap max-w-[150px] overflow-hidden text-ellipsis"
            >
                {{ row[col.Field] }}
            </td>
        </tr>
    </tbody>
  </table>
</template>
