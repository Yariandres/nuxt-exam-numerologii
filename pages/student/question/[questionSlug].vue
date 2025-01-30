<script setup lang="ts">
const testStore = useTestStore();
const staticTime = 60; // Static timer duration set by admin
</script>

<template>
  <div class="flex flex-col justify-center h-screen">
    <div
      class="mx-auto p-6 w-full max-w-6xl ring-1 ring-green-500 rounded-lg shadow-md"
    >
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold mb-4">Numerology Test</h1>
        <ExamTimer :time="staticTime" />
      </div>
      <ExamQuestionDisplay
        v-if="!testStore.isTestComplete"
        :question="testStore.currentQuestion"
        :answers="testStore.currentAnswers"
        @answerSelected="testStore.selectAnswer"
      />
      <div class="flex justify-between mt-4">
        <UButton
          v-if="!testStore.isTestComplete"
          :disabled="testStore.currentQuestionIndex === 0"
          @click="testStore.previousQuestion"
          class="p-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Previous Question
        </UButton>
        <UButton
          v-if="!testStore.isTestComplete"
          :disabled="!testStore.selectedAnswers[testStore.currentQuestionIndex]"
          @click="testStore.nextQuestion"
          class="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {{ testStore.isLastQuestion ? 'Finish Test' : 'Next Question' }}
        </UButton>
      </div>
    </div>
  </div>
</template>
