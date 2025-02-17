<script setup lang="ts">
const { timerMinutes, isTimeUp, fetchTimerSettings, handleTimeUp } =
  useExamTimer();
definePageMeta({
  layout: 'student',
});

const route = useRoute();
const router = useRouter();

interface Answer {
  id: string;
  text: string;
}

interface Question {
  id: string;
  slug: string;
  title: string;
  answers: Answer[];
  category: string;
  difficulty: string;
}

const currentQuestion = ref<Question | null>(null);
const selectedAnswer = ref<string>('');
const isLoading = ref(true);
const error = ref('');
const isSubmitting = ref(false);

// Check exam session on client side only
onMounted(async () => {
  const examSessionId = localStorage.getItem('examSessionId');
  if (!examSessionId) {
    router.push('/');
    return;
  }

  // Fetch question data
  fetchQuestion();
  await fetchTimerSettings();
});

const fetchQuestion = async () => {
  try {
    isLoading.value = true;
    const question = await $fetch<Question>(
      `/api/exam/questions/${route.params.questionSlug}`
    );
    currentQuestion.value = question;
  } catch (err) {
    console.error('Failed to fetch question:', err);
    error.value = 'Failed to load question. Please try again.';
  } finally {
    isLoading.value = false;
  }
};

const handleAnswerSelect = (answerId: string) => {
  selectedAnswer.value = answerId;
};

const submitAnswer = async () => {
  if (!selectedAnswer.value || !currentQuestion.value || isSubmitting.value)
    return;

  try {
    isSubmitting.value = true;

    const examSessionId = localStorage.getItem('examSessionId');
    if (!examSessionId) {
      router.push('/');
      return;
    }

    // Submit answer to the server
    const response = await $fetch('/api/exam/submit-answer', {
      method: 'POST',
      body: {
        examSessionId,
        questionId: currentQuestion.value.id,
        answerId: selectedAnswer.value,
      },
    });

    // If this was the last question, redirect to results
    if (response.examCompleted) {
      router.push('/student/results');
      return;
    }

    // Otherwise, go to the next question
    if (response.nextQuestionSlug) {
      router.push(`/student/question/${response.nextQuestionSlug}`);
    }
  } catch (err) {
    console.error('Failed to submit answer:', err);
    error.value = 'Failed to submit answer. Please try again.';
  } finally {
    isSubmitting.value = false;
  }
};

const handleExamSubmission = () => {
  // Your exam submission logic here
  navigateTo('/exam/summary');
};

// Handle time up
watch(isTimeUp, (newValue) => {
  if (newValue) {
    // Auto submit exam
    handleExamSubmission();
  }
});
</script>

<template>
  <div class="max-w-3xl mx-auto px-4 py-8">
    <!-- Loading State -->
    <div
      v-if="isLoading"
      class="flex justify-center items-center min-h-[400px]"
    >
      <UIcon name="i-heroicons-arrow-path" class="animate-spin h-8 w-8" />
    </div>

    <!-- Error State -->
    <div
      v-else-if="error"
      class="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700"
    >
      {{ error }}
      <UButton
        size="sm"
        color="red"
        variant="ghost"
        @click="router.go(0)"
        class="ml-4"
      >
        Retry
      </UButton>
    </div>

    <!-- Question Display -->
    <div v-else-if="currentQuestion" class="space-y-6">
      <ExamTimer :minutes="timerMinutes" @time-up="handleTimeUp" />
      <!-- Question Header -->
      <div class="flex justify-between items-start">
        <h1 class="text-2xl font-bold flex-1">
          {{ currentQuestion.title }}
        </h1>
        <span class="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600">
          {{ currentQuestion.category }}
        </span>
      </div>

      <!-- Answer Options -->
      <div class="space-y-4">
        <div
          v-for="answer in currentQuestion.answers"
          :key="answer.id"
          class="flex items-center"
        >
          <label
            :for="answer.id"
            class="flex-1 p-4 border rounded-lg cursor-pointer transition-colors"
            :class="{
              'bg-emerald-600 border-emerald-200': selectedAnswer === answer.id,
              'hover:bg-gray-500': selectedAnswer !== answer.id,
            }"
          >
            <input
              type="radio"
              :id="answer.id"
              :value="answer.id"
              v-model="selectedAnswer"
              class="mr-3"
              @change="handleAnswerSelect(answer.id)"
            />
            {{ answer.text }}
          </label>
        </div>
      </div>

      <!-- Submit Button -->
      <div class="flex justify-end">
        <UButton
          @click="submitAnswer"
          :loading="isSubmitting"
          :disabled="!selectedAnswer || isSubmitting"
          color="primary"
          icon="i-heroicons-arrow-right"
        >
          Submit Answer
        </UButton>
      </div>
    </div>
  </div>
</template>
