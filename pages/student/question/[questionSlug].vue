<script setup lang="ts">
import { useExamStore } from '~/store/examStore';

const examStore = useExamStore();

// Handle answer selection
const handleAnswerSelect = (answerId: string) => {
  examStore.selectedAnswer = answerId;
};

// Handle answer submission
const handleSubmitAnswer = () => {
  examStore.submitAnswer();

  if (examStore.examCompleted) {
    // TODO: Redirect to summary page
    navigateTo('/student/student');
  }
};

// Handle next question
const handleNextQuestion = () => {
  examStore.goToNextQuestion();
};

const handleGenerateCertificate = () => {
  console.log('Generating certificate...');
};

const staticTime = 60;
</script>

<template>
  <div class="flex flex-col justify-center min-h-screen py-8">
    <template v-if="!examStore.examCompleted">
      <div
        class="mx-auto p-6 w-full max-w-6xl ring-1 ring-green-500 rounded-lg shadow-md"
      >
        <!-- Header -->
        <div class="flex justify-between items-center mb-8">
          <h1 class="text-2xl font-bold">Numerology Test</h1>
          <ExamTimer :time="staticTime" />
        </div>

        <!-- Progress Bar -->
        <div class="mb-6">
          <div class="text-sm text-gray-500">
            Question {{ examStore.currentQuestionIndex + 1 }} of
            {{ examStore.examResult.totalQuestions }}
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2.5">
            <div
              class="bg-green-500 h-2.5 rounded-full"
              :style="`width: ${
                ((examStore.currentQuestionIndex + 1) /
                  examStore.examResult.totalQuestions) *
                100
              }%`"
            ></div>
          </div>
        </div>

        <!-- Question Display Component -->
        <ExamQuestionDisplay
          v-if="examStore.currentQuestion"
          :question="examStore.currentQuestion"
          :selected-answer="examStore.selectedAnswer"
          :is-answer-submitted="examStore.isAnswerSubmitted"
          @select-answer="handleAnswerSelect"
        />

        <!-- Navigation Buttons -->
        <div class="flex justify-end mt-8 space-x-4">
          <UButton
            v-if="!examStore.isAnswerSubmitted"
            @click="handleSubmitAnswer"
            :disabled="!examStore.selectedAnswer"
            color="green"
            size="lg"
          >
            Submit Answer
          </UButton>

          <UButton v-else @click="handleNextQuestion" color="green" size="lg">
            Next Question
          </UButton>
        </div>
      </div>
    </template>
  </div>
</template>
