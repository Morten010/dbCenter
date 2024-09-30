<script setup lang='ts'>
const choice = ref<null | {
  view: 'table' | 'query' | 'diagram'
  name: string
}>(null)
</script>

<template>
  <main
    class="bg-[#101014] min-h-screen text-white max-w-[100vw] overflow-auto flex flex-col"
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
          class="flex-grow max-w-[calc(100vw-200px)] max-h-[calc(100vh-56px)] overflow-auto"
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
            v-if="choice"
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
          />
          <!-- query editor -->
        </div>
      <!-- content -->
    </div>
  </main>
</template>