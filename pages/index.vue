<script setup lang="ts">
const { questions } = useQuestions();

const isLoading = ref(false);
const studentName = ref('');
const nameError = ref('');

const validateAndStart = async () => {
  // Reset error state
  nameError.value = '';

  // Basic validation
  if (!studentName.value.trim()) {
    nameError.value = 'Please enter your name';
    return;
  }

  if (studentName.value.length < 3) {
    nameError.value = 'Name must be at least 3 characters long';
    return;
  }

  isLoading.value = true;
  try {
    localStorage.setItem('studentName', studentName.value.trim());
    await navigateTo(`${questions[0].path}`);
  } catch (error) {
    console.error('Failed to start exam:', error);
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="max-w-3xl mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-6">
      Welcome to the Numerology Certification Exam
    </h1>
    <pre>{{ questions }}</pre>
    <div class="rounded-lg shadow-md p-6 mb-8">
      <h2 class="text-xl font-semibold mb-4">Exam Instructions</h2>

      <ul class="list-disc pl-6 space-y-2 mb-6">
        <li>This exam consists of multiple-choice questions</li>
        <li>You must achieve a minimum score to pass</li>
        <li>You can navigate between questions using previous/next buttons</li>
        <li>Your results will be available immediately after submission</li>
        <li>If you don't pass, you can retake the exam immediately</li>
      </ul>

      <div class="mb-6">
        <label
          for="studentName"
          class="block text-sm font-medium text-gray-700 mb-2"
        >
          Enter your full name (as it will appear on the certificate)
        </label>
        <input
          id="studentName"
          v-model="studentName"
          type="text"
          class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          :class="{ 'border-red-500': nameError }"
          placeholder="e.g., John Smith"
          @keyup.enter="validateAndStart"
        />
        <p v-if="nameError" class="mt-1 text-sm text-red-600">
          {{ nameError }}
        </p>
      </div>

      <UButton
        @click="validateAndStart"
        :disabled="isLoading"
        icon="i-heroicons-arrow-right"
      >
        <span v-if="isLoading">Loading...</span>
        <span v-else>Begin Exam</span>
      </UButton>
    </div>
  </div>
</template>
