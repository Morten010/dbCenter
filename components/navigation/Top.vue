<script setup lang='ts'>
import { editorTopNavConst } from '~/constants';
import { useDbStore } from '~/store/dbStore';
import type { databaseStoreProps } from '~/types/store';

const {
  params: {
    id
  }
} = useRoute()
const model = defineModel<{
    view: string,
    name: string
}>()

const db = useDbStore().getSpecificContainer(id as string)

</script>

<template>
  <div
    class="w-full border-b border-[#1D1E24] flex justify-between items-center"
  >
    <div
        class="flex items-center p-4 gap-2 font-semibold"
    >
        <NuxtLink
            href="/"
            class="flex items-center"
        >
            <Icon 
                name="ic:round-chevron-left" 
                size="24"
            />
        </NuxtLink>
        {{ db?.name ? db?.name : '...' }}
    </div>

    <div
      class="flex gap-2 pr-4 text-sm"
    >
      <div
        :class="cn(
          'flex items-center gap-2 hover:bg-[#191a1e] text-[#5a5d67] px-3 py-1.5 rounded font-semibold cursor-pointer transition-colors duration-100',
          {
            'bg-[#141A39] text-[#526FDF]': model?.view === link.view
          }
        )"
        @click="model = {
          name: '',
          view: link.view
        }"
        v-for="link in editorTopNavConst"
      >
        <Icon 
          :name="link.icon"
        />
        {{ link.title }}
      </div>
    </div>
  </div>
</template>