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

console.log(clmns);

</script>

<template>
  <table class="w-full">
    <thead class="w-full">
        <tr>
            <th
                v-for="col in clmns"
                :key="col"
                class="py-1 px-3 border text-sm border-[#1D1E24] whitespace-nowrap text-nowrap"
            >
                {{ col.Field }}
            </th>
        </tr>
    </thead>

    <tbody>
        <tr
            v-for="(row, index) in data"
            :key="index"
        >
            <td
                v-for="col in clmns"
                :key="col"
                class="text-sm py-1 px-3 border border-[#1D1E24] whitespace-nowrap text-nowrap max-w-[150px] overflow-hidden"
            >
                {{ row[col.Field] }}
            </td>
        </tr>
    </tbody>
  </table>
</template>
