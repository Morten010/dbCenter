<script setup lang='ts'>
import { sideNavConsts } from '~/constants';
</script>

<template>
  <div
    class="border-r border-[#1D1E24] min-w-[200px]"
  >
    <div
        class="p-4 border-[#1D1E24] border-b"
    >
        <h2
            class="font-semibold mb-2"
        >
            Table Content
        </h2>
        <ul>
            <li
                class="flex gap-2 items-center text-sm text-[#4F5052] hover:text-white transition-all duration-150 cursor-pointer hover:pl-1"
                v-for="table of sideNavConsts"
            >
                <Icon 
                    name="ic:round-chevron-right" 
                    size="16"
                    class="mt-0.5"
                />
                <p>
                    {{ table }}
                </p>
            </li>
        </ul>
    </div>

    <div
        class="p-4"
    >
        <h2
            class="font-semibold mb-2"
        >
            Saved Queries
        </h2>
        <div
            class="text-sm flex gap-2 items-center text-[#4F5052] cursor-pointer hover:text-white transition-all duration-150"
        >
            <Icon 
                name="tabler:sql" 
                size="16"
                class="mt-0.5"
            />
            <p>
                All users
            </p>
        </div>
    </div>
  </div>
</template>