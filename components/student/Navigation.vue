<script setup lang="ts">
const user = useSupabaseUser();
</script>

<template>
  <header>
    <nav>
      <div class="mx-8 my-4 flex justify-end">
        <UButton @click="navigateTo('/auth')" color="emerald">
          {{ user ? 'Dashboard' : 'Admin Login' }}
        </UButton>
      </div>
    </nav>
  </header>
</template>
