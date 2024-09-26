<script setup lang="ts"></script>

<template>
  <div class="flex flex-col py-[10px] px-[20px] border border-[#1D1E24] rounded-[8px] gap-[14px]">
    <!-- top -->
     <div
      class="flex gap-5 items-center"
     >
        <Icon name="devicon:mysql" size="38" />
        <div>
          <h2
            class="font-semibold"
          >
            Database name
          </h2>
          <p
            class="text-sm text-[#8C8E98]"
          >
            Mysql 9.x.x @ 3306
          </p>
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
       >
        <button 
            class="text-[#8C8E98] opacity-50 cursor-not-allowed"
            disabled
          >
            <Icon 
              name="ri:database-line"
              size="20" 
            />
          </button>
       </UiTooltip>
      <!-- editor button -->
      <!-- start button -->
      <UiTooltip
        title="Start database"
      >
        <button class="text-[#8C8E98]">
          <Icon name="solar:play-linear" size="20" />
        </button>
      </UiTooltip>
      <!-- start button -->
    </div>
    <!-- bottom -->
  </div>
</template>
