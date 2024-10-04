<script setup lang='ts'>
import type { HTMLAttributes } from 'vue';

const {
  columns,
  rows,
  class: className
} = defineProps<{
  columns: any
  rows: any
  class?: HTMLAttributes['class']
}>()

console.log('columns');
console.log(columns);
console.log('Rows');
console.log(rows);

</script>

<template>
  <table 
    :class="cn(
      'w-full',
      className
    )"
  >
    <thead class="w-full bg-modal-bg">
        <tr>
            <th
                v-for="col in columns"
                :key="col"
                class="py-1.5 px-4 border text-sm border-border [#e7e7e8]space-nowrap text-nowrap bg-modal-bg font-normal"
            >
                {{ col.name }}
            </th>
        </tr>
    </thead>

    <tbody>
        <tr
            v-for="(row, index) in rows"
            :key="index"
            class="outline-transparent hover:outline-primary hover:bg-[#162421] outline outline-1 transition-all duration-150 cursor-pointer"
        >
            <td
                v-for="col in columns"
                :key="col"
                class="text-sm py-1.5 px-4 border border-border [#e7e7e8]space-nowrap text-nowrap max-w-[150px] overflow-hidden text-ellipsis"
            >
                {{ row[col.name] }}
            </td>
        </tr>
    </tbody>
  </table>
</template>