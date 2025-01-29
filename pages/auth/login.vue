<script setup lang="ts">
import { useUserStore } from '@/stores/user';
import { z } from 'zod';
import type { FormSubmitEvent } from '#ui/types';

const userStore = useUserStore();

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Must be at least 8 characters'),
});

type Schema = z.output<typeof schema>;

const state = reactive({
  // TODO: remove this hardcoded values
  email: 'yari@gmail.com',
  password: '12345678',
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
  // Do something with data
  try {
    await userStore.login(event.data.email, event.data.password);
    navigateTo('/');
  } catch (error) {
    console.error(error);
  } finally {
    navigateTo('/');
  }
}
</script>

<template>
  <div class="flex flex-col items-center justify-center h-screen">
    <div class="w-full max-w-md ring-1 ring-green-600 rounded-lg p-8">
      <UForm
        :schema="schema"
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
      >
        <UFormGroup label="Email" name="email">
          <UInput v-model="state.email" />
        </UFormGroup>

        <UFormGroup label="Password" name="password">
          <UInput
            v-model="state.password"
            type="password"
            placeholder="Password"
          />
        </UFormGroup>

        <UButton type="submit"> Submit </UButton>
      </UForm>
    </div>
  </div>
</template>
