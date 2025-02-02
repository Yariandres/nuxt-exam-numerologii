<script setup lang="ts">
interface Answer {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface Media {
  image: string | null;
  audio: string | null;
  video: string | null;
}

interface Question {
  id: string;
  slug: string;
  title: string;
  answers: Answer[];
  media: Media;
}

interface Props {
  question: Question;
  selectedAnswer: string | null;
  isAnswerSubmitted: boolean;
}

interface Emits {
  (e: 'select-answer', answerId: string): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const handleAnswerSelect = (answerId: string) => {
  emit('select-answer', answerId);
};
</script>

<template>
  <div class="question-display">
    <!-- Question Title -->
    <h2 class="text-xl font-semibold mb-6">
      {{ question.title }}
    </h2>

    <!-- Media Section -->
    <div v-if="question.media.image || question.media.video" class="mb-6">
      <img
        v-if="question.media.image"
        :src="question.media.image"
        alt="Question visual"
        class="max-w-full h-auto rounded-lg"
      />
      <!-- Video player could be added here -->
    </div>

    <!-- Answers -->
    <div class="space-y-4">
      <button
        v-for="answer in question.answers"
        :key="answer.id"
        @click="handleAnswerSelect(answer.id)"
        :class="[
          'w-full p-4 text-left rounded-lg border transition-all',
          selectedAnswer === answer.id
            ? 'border-green-500 bg-green-50'
            : 'border-gray-200 hover:border-green-200',
          isAnswerSubmitted && answer.isCorrect
            ? 'bg-green-100 border-green-500'
            : isAnswerSubmitted &&
              selectedAnswer === answer.id &&
              !answer.isCorrect
            ? 'bg-red-100 border-red-500'
            : '',
        ]"
        :disabled="isAnswerSubmitted"
      >
        <div class="flex justify-between items-center">
          <span>{{ answer.text }}</span>
          <span
            v-if="isAnswerSubmitted && answer.isCorrect"
            class="text-green-600"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clip-rule="evenodd"
              />
            </svg>
          </span>
        </div>
      </button>
    </div>
  </div>
</template>
