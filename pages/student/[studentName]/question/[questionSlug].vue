<script setup lang="ts">
import { useExamStore } from '~/stores/examStore';
import QuestionDisplay from '~/components/exam/QuestionDisplay.vue';
import Summary from '~/components/exam/Summary.vue';

const router = useRouter();
const examStore = useExamStore();

// Handle answer selection
const handleAnswerSelect = (answerId: string) => {
  examStore.selectedAnswer = answerId;
};

// Handle answer submission
const handleSubmitAnswer = () => {
  examStore.submitAnswer();

  if (examStore.examCompleted) {
    navigateTo('/student/exam/summary');
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
        <QuestionDisplay
          v-if="examStore.currentQuestion"
          :question="examStore.currentQuestion"
          :selected-answer="examStore.selectedAnswer"
          :is-answer-submitted="examStore.isAnswerSubmitted"
          @select-answer="handleAnswerSelect"
        />

        <!-- Navigation Buttons -->
        <div class="flex justify-end mt-8 space-x-4">
          <button
            v-if="!examStore.isAnswerSubmitted"
            @click="handleSubmitAnswer"
            :disabled="!examStore.selectedAnswer"
            class="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
          >
            Submit Answer
          </button>

          <button
            v-else
            @click="handleNextQuestion"
            class="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Next Question
          </button>
        </div>
      </div>
    </template>
    <!-- <Summary
      v-else
      :exam-result="examStore.examResult"
      @retake-exam="handleRetakeExam"
      @generate-certificate="handleGenerateCertificate"
    /> -->
  </div>
</template>
