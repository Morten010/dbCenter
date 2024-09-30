<script setup lang='ts'>
import { Codemirror } from 'vue-codemirror';
import { sql, type SQLConfig } from "@codemirror/lang-sql"
const code = ref<string>('')

const mysql = await useMysql()

const res = await mysql.query('SHOW TABLES;')
const data: null | {
  Tables_in_tables: string
}[] = res.data
console.log(res);
console.log(res);

const sqlConfig: SQLConfig = {
  tables: data ? data.map(table => ({
    label: table.Tables_in_tables,
    displayLabel: table.Tables_in_tables,
    
  })) :  [],

}
console.log(sqlConfig);


</script>

<template>
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
</template>