<script setup lang='ts'>
const choice = ref<null | {
  view: 'table' | 'query' | 'diagram'
  name: string
}>(null)
const success = ref<boolean>(false)

try{
  const mysql = await useMysql()

  const res = await mysql.query('SELECT 1;')
  console.log(res);
 

  if(res.success){
    success.value = true
  }else {
    success.value = false
  }
}catch{
  success.value = false
}
console.log(choice);

</script>

<template>
  <main
    class="h-screen w-full grid place-content-center text-center"
    v-if="!success"
  >
    <h1
      class="text-2xl font-semibold"
    >
      Failed to connect
    </h1>
    <p
      class="mb-2 text-[#fafafa]/60"
    >
      Failed to connect to mysql database
    </p>
    <div
      class="flex gap-2"
    >
      <NuxtLink
        class="flex items-center gap-2 px-3 py-1.5 bg-primary/30 rounded"
        to="/"
      >
        <Icon name="ep:back" />
        Go back
      </NuxtLink>
      <button
        class="flex items-center gap-2 px-3 py-1.5 bg-primary rounded"
      >
        Try to connect
      </button>
    </div>
  </main>
  <main
    class="bg-[#101014] min-h-screen text-white max-w-[100vw] overflow-auto flex flex-col"
    v-if="success"
  >
    <!-- top nav -->
     <NavigationTop 
        v-model="choice"
     />
    <!-- top nav -->

    <div
      class="flex flex-grow"
    >
      <!-- side nav -->
      <NavigationSide 
        v-model="choice"
      />
      <!-- side nav -->

      <!-- content -->
        <div
          class="flex-grow max-w-[calc(100vw-200px)] max-h-[calc(100vh-57px)] overflow-auto"
        >
          <!-- empty -->
          <div
            v-if="!choice"
            class="flex-grow grid place-content-center w-full h-full"
          >
            <h2>
                Nothing to see here
            </h2>
          </div>
          <!-- empty -->

          <!-- table -->
          <Table 
            v-if="choice?.view === 'table'"
            :name="choice?.name"
            :key="choice.name"
          />
          <!-- table -->

          <!-- diagram -->
          <!-- https://vueflow.dev/ -->
          <!-- diagram -->

          <!-- query editor -->
          <!-- https://github.surmon.me/vue-codemirror -->
          <QueryEditor
            v-if="choice?.view === 'query'"
            :query-name="choice.name"
            :key="choice.name"
          />
          <!-- query editor -->
        </div>
      <!-- content -->
    </div>
  </main>
</template>