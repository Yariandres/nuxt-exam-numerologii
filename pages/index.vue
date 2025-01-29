<script setup lang="ts">
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();

if (!userStore.user) {
  navigateTo('/auth/login');
}
</script>

<template>
  <section class="flex flex-col items-center justify-center h-screen">
    <UCard>
      <p class="text-right">{{ userStore.user?.email }}</p>
      <h1 class="text-2xl font-bold">Welcome to the Numerology Test!</h1>
      <p class="mt-4">
        You are about to take a test that will assess your knowledge of
        numerology.
      </p>
      <h2 class="mt-6">Test Details:</h2>
      <ul class="list-disc list-inside">
        <li>Number of Questions: 30</li>
        <li>Time Limit: 30 minutes</li>
        <li>Passing Score: 50%</li>
      </ul>
      <h2 class="mt-6">Instructions:</h2>
      <p>
        Please read each question carefully and select the best answer. Good
        luck!
      </p>
    </UCard>

    <UButton class="mt-4" color="indigo" size="lg" to="/student">
      Start Test
    </UButton>
  </section>
</template>
