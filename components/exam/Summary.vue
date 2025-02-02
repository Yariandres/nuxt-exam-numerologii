<script setup lang="ts">
interface ExamResult {
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  passed: boolean;
  failedQuestions: {
    title: string;
    userAnswer: string;
    correctAnswer: string;
    explanation: string;
  }[];
}

const props = defineProps<{
  examResult: ExamResult;
}>();

const emit = defineEmits<{
  retakeExam: []; // No payload needed
  generateCertificate: []; // No payload needed
}>();

const scorePercentage = computed(() => {
  return Math.round(
    (props.examResult.score / props.examResult.totalQuestions) * 100
  );
});

const handleRetakeExam = () => {
  emit('retakeExam');
};

const handleGenerateCertificate = () => {
  emit('generateCertificate');
};
</script>

<template>
  <div class="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-lg">
    <!-- Result Header -->
    <div class="text-center mb-8">
      <div
        class="inline-flex items-center justify-center w-24 h-24 rounded-full mb-4"
        :class="examResult.passed ? 'bg-green-100' : 'bg-red-100'"
      >
        <span
          class="text-4xl"
          :class="examResult.passed ? 'text-green-600' : 'text-red-600'"
        >
          {{ scorePercentage }}%
        </span>
      </div>
      <h1
        class="text-3xl font-bold mb-2"
        :class="examResult.passed ? 'text-green-600' : 'text-red-600'"
      >
        {{
          examResult.passed ? 'Congratulations! You Passed!' : 'Exam Not Passed'
        }}
      </h1>
      <p class="text-gray-600">
        You answered {{ examResult.correctAnswers }} out of
        {{ examResult.totalQuestions }} questions correctly
      </p>
    </div>

    <!-- Failed Questions Section -->
    <div v-if="examResult.failedQuestions.length > 0" class="mb-8">
      <h2 class="text-xl font-semibold mb-4 text-gray-800">
        Questions to Review:
      </h2>
      <div class="space-y-6">
        <div
          v-for="(question, index) in examResult.failedQuestions"
          :key="index"
          class="p-4 bg-red-50 rounded-lg"
        >
          <h3 class="font-medium text-gray-800 mb-2">
            {{ question.title }}
          </h3>
          <div class="space-y-2 text-sm">
            <p class="text-red-600">Your answer: {{ question.userAnswer }}</p>
            <p class="text-green-600">
              Correct answer: {{ question.correctAnswer }}
            </p>
            <p class="text-gray-600 mt-2">
              {{ question.explanation }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex justify-center space-x-4">
      <UButton
        v-if="!examResult.passed"
        @click="handleRetakeExam"
        color="blue"
        size="lg"
      >
        Retake Exam
      </UButton>
      <UButton
        v-else
        @click="handleGenerateCertificate"
        color="green"
        size="lg"
      >
        Generate Certificate
      </UButton>
    </div>
  </div>
</template>
