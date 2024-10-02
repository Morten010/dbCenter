<script setup lang="ts">
import type Dockerode from 'dockerode';
import { toast } from 'vue-sonner';
import { useDbStore } from '~/store/dbStore';
import type { databaseStoreProps } from '~/types/store';

const { database } = defineProps<{
  database: databaseStoreProps
}>()

const { startDatabase, stopDatabase, deleteDatabase } = useDbStore()

const handleCopyConnectionString = () => {
  navigator.clipboard.writeText(`mysql://${database.user}:${database.password}@127.0.0.1:${database.port}/tables`)
  toast.success('Copied connection string to clipboard')
}

</script>

<template>
  <div class="flex flex-col p-[15px] border border-border rounded-[8px] gap-[14px] relative bg-modal-bg shadow-md">

    <!-- top -->
     <div
      class="flex gap-5 items-center"
     >
        <div
          class="bg-[#122322] p-2 aspect-square w-12 grid place-content-center h-12 rounded"
        >
          <Icon 
            name="fontisto:mysql" 
            class="text-primary"
            size="38" 
          />
        </div>
        <div>
          <h2
            class="font-semibold"
          >
            {{ database.name }}
          </h2>
          <p
            class="text-sm text-[#8C8E98]"
          >
            Mysql {{ database.version }} @ {{ database.port }}
          </p>
        </div>

        <div
          class="self-center ml-auto"
        >
          <div
            class="relative"
          >
            <div 
              :class="cn(
                'w-1.5 h-1.5 rounded-full animate-ping transition-colors duration-200',
                {
                  'bg-green-600': database.status === 'on',
                  'bg-yellow-500': database.status === 'loading',
                  'bg-red-600': database.status === 'off'
                }
              )"
            />
            <div 
              :class="cn(
                'w-1.5 h-1.5 rounded-full absolute left-0 top-0 transition-colors duration-200',
                {
                  'bg-green-600': database.status === 'on',
                  'bg-yellow-500': database.status === 'loading',
                  'bg-red-600': database.status === 'off'
                }
              )"
            />
          </div>
        </div>
     </div>
    <!-- top -->

    <!-- bottom -->
    <div
      class="flex gap-1 items-center justify-end"
    >
      <!-- editor button -->
       <UiTooltip
        title="Coming soon"
        v-if="database.status === 'on'"
       >
        <NuxtLink
          :href="false ? '#' : `/editor/${database.volumeName}`"
          class="text-[#8C8E98] opacity-50 cursor-not-allowed"
          disabled
        >
          <Icon 
            name="bi:diagram-2"
            size="20" 
          />
        </NuxtLink>
       </UiTooltip>
      <!-- editor button -->

      <!-- delete button -->
      <UiTooltip
        title="Delete database"
      >
        <button 
          class="text-[#8C8E98] hover:text-[#e7e7e8]"
          @click="deleteDatabase(database.volumeName)"
        >
          <Icon 
            name="solar:trash-bin-2-outline" 
            size="20" 
          />
        </button>
      </UiTooltip>
      <!-- delete button -->

      <!-- copy connection string button -->
      <UiTooltip
        title="Copy connection string"
      >
        <button 
          class="text-[#8C8E98] hover:text-[#e7e7e8]"
          @click="handleCopyConnectionString"
        >
          <Icon 
            name="solar:copy-linear" 
            size="20" 
          />
        </button>
      </UiTooltip>
      <!-- copy connection string button -->

      <!-- start button -->
      <UiTooltip
        :title="database.status === 'loading' ? 'Loading...' : database.status === 'on' ? 'Shutdown database' : 'Start database'"
      >
        <button 
          class="text-[#8C8E98] hover:text-[#e7e7e8]"
          @click="() => database.status === 'off' ? startDatabase(database.volumeName) : stopDatabase(database.containerId!)"
          :disabled="database.status === 'loading'"
        >
          <Icon 
            name="solar:play-linear" 
            size="20" 
            v-if="database.status === 'off'"
          />
          <Icon 
            name ="mingcute:pause-line" 
            size="20" 
            v-if="database.status === 'on'"
          />
          <Icon 
            name="fluent:spinner-ios-20-regular"
            size="20"
            class="animate-spin"
            v-if="database.status === 'loading'"
          />
        </button>
      </UiTooltip>
      <!-- start button -->
    </div>
    <!-- bottom -->
  </div>
</template>
