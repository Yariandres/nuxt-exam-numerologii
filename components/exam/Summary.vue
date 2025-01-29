<script setup lang="ts">
import { useTestStore } from '@/stores/testStore';

const testStore = useTestStore();

const wrongAnswers = computed(() => {
  const wrongAnswers = testStore.selectedAnswers.filter(
    (answer: any) => !answer.isCorrect
  );
  return wrongAnswers;
});

const correctAnswers = computed(() => {
  const correctAnswers = testStore.selectedAnswers.filter(
    (answer: any) => answer.isCorrect
  );
  return correctAnswers;
});

function generateCertificate() {
  console.log('generateCertificate');
}
</script>
<template>
  <div class="flex flex-col items-center justify-center h-screen">
    <div
      class="mx-auto p-6 w-full max-w-6xl ring-1 ring-green-500 rounded-lg shadow-md"
    >
      <h1 class="text-3xl font-bold mb-6 text-center">Exam Summary</h1>

      <div class="text-center mb-8">
        <p class="text-2xl font-semibold">
          {{ testStore.examResults.percentage }}%
          <span
            :class="[
              testStore.examResults.isPassed
                ? 'text-green-600'
                : 'text-red-600',
            ]"
            >{{ testStore.examResults.isPassed ? 'PASSED' : 'FAILED' }}</span
          >
        </p>
      </div>

      <!-- Results Overview -->
      <div class="">
        <div class="p-4 rounded-lg">
          <p class="text-lg font-semibold text-green-600">Correct Answers</p>
          <p v-for="answer in correctAnswers">
            {{ answer.question }}
          </p>
        </div>

        <div class="p-4 rounded-lg">
          <p class="text-lg font-semibold text-red-600">Wrong Answers</p>
          <p v-for="answer in wrongAnswers">
            {{ answer.question }}
          </p>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-center space-x-4 mt-4">
        <template v-if="testStore.examResults.percentage >= 50">
          <UButton
            @click="generateCertificate"
            class="bg-green-500 hover:bg-green-600 px-6 py-2 rounded-lg"
          >
            Generate Certificate
          </UButton>
        </template>
        <template v-else>
          <UButton
            @click="testStore.resetTest"
            class="bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded-lg"
          >
            Retake Exam
          </UButton>
        </template>
        <UButton
          to="/"
          class="bg-gray-500 hover:bg-gray-600 px-6 py-2 rounded-lg"
        >
          Back to Home
        </UButton>
      </div>
    </div>
  </div>
</template>
