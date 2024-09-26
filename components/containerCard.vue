<script setup lang="ts"></script>

<template>
  <div class="flex justify-between items-center">
    <!-- left -->
    <div class="flex gap-2 items-center">
      <div
        class="border rounded-lg w-[60px] h-[60px] grid place-content-center">
        <Icon name="devicon:mysql" size="38" />
      </div>
      <div>
        <h1 class="font-semibold">Database name</h1>
        <p>Mysql 9.x.x @ 3306</p>
      </div>
    </div>
    <!-- left -->

    <!-- right -->
    <div
      class="flex gap-1 items-center"
    >
      <!-- editor button -->
        <button 
          class="border rounded-lg w-9 h-9 grid place-content-center"
        >
          <Icon 
            name="ri:database-line"
            size="20" 
          />
        </button>
      <!-- editor button -->
      <!-- start button -->
      <button class="border rounded-lg w-9 h-9 grid place-content-center">
        <Icon name="solar:play-linear" size="20" />
      </button>
      <!-- start button -->
    </div>
    <!-- right -->
  </div>
</template>
