<script setup lang="ts">
const timerMinutes = ref(30);
const isLoading = ref(false);
const error = ref('');

definePageMeta({
  layout: 'admin',
});

// Fetch current settings
const fetchSettings = async () => {
  try {
    isLoading.value = true;
    const { data, error: fetchError } = await useFetch('/api/admin/settings');

    if (fetchError.value) {
      throw fetchError.value;
    }

    if (data.value) {
      timerMinutes.value = data.value.timerMinutes;
    }
  } catch (err) {
    console.error('Failed to load settings:', err);
    error.value = 'Failed to load settings';
  } finally {
    isLoading.value = false;
  }
};

// Update timer settings
const updateSettings = async () => {
  try {
    isLoading.value = true;
    const { error: updateError } = await useFetch('/api/admin/settings', {
      method: 'PUT',
      body: { timerMinutes: timerMinutes.value },
    });

    if (updateError.value) {
      throw updateError.value;
    }
  } catch (err) {
    console.error('Failed to update settings:', err);
    error.value = 'Failed to update settings';
  } finally {
    isLoading.value = false;
  }
};

// Load settings on mount
onMounted(() => {
  fetchSettings();
});
</script>

<template>
  <div class="max-w-xl mx-auto p-6">
    <h2 class="text-2xl font-bold mb-6">Exam Settings</h2>

    <div v-if="isLoading" class="flex justify-center py-12">
      <UIcon name="i-heroicons-arrow-path" class="animate-spin h-8 w-8" />
    </div>

    <div v-else class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700">
          Exam Duration (minutes)
        </label>
        <UInput
          v-model="timerMinutes"
          type="number"
          min="1"
          max="180"
          class="mt-1"
        />
      </div>

      <UButton @click="updateSettings" :loading="isLoading" color="primary">
        Save Settings
      </UButton>

      <p v-if="error" class="text-red-500">{{ error }}</p>
    </div>
  </div>
</template>
