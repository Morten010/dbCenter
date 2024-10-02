<script setup lang='ts'>
import { editorTopNavConst } from '~/constants';
import { useDbStore } from '~/store/dbStore';

const {
  params: {
    id
  }
} = useRoute()
const choice = defineModel<null | {
    view: string,
    name: string
}>()

const db = useDbStore().getSpecificContainer(id as string)

</script>

<template>
  <div
    class="w-full border-b border-border flex justify-between items-center"
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
          'flex items-center gap-2 hover:bg-[#183126] text-[#a0a4a5] px-3 py-1.5 rounded font-semibold cursor-pointer transition-all duration-100',
          {
            'bg-[#183126] text-primary': choice?.view === link.view
          }
        )"
        @click="choice = {
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