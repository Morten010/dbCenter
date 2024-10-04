<script setup lang="ts">
const {
    icon,
    name
} = defineProps<{
    icon: string,
    name: string
}>()

const database = defineModel()

const emit = defineEmits<{
    (event: 'clearVersions'): void 
}>()

const handleChangeDbType = (newDbChoice: string) => {
  if(database.value === newDbChoice) return
  database.value = newDbChoice
  emit('clearVersions')
}
</script>

<template>
  <button
    type="button"
    :class="
      cn(
        'border border-border p-2 grid place-content-center rounded text-primary/20 hover:bg-[#122322]/70 hover:text-primary/70 transition-colors duration-100 shadow-md',
        {
          'border-primary bg-[#122322] text-primary':
            database === name,
        }
      )
    "
    @click="() => handleChangeDbType(name)">
    <Icon :name="icon" size="38" />
  </button>
</template>
