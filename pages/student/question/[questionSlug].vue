<script setup lang="ts">
const { isTimeUp, initializeTimer, clearTimer, timerMinutes } = useExamTimer();
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
    navigateTo('/');
    return;
  }

  try {
    // Initialize timer with the time-up handler
    await initializeTimer(() => {
      handleTimeUp();
    });

    // Then fetch question
    await fetchQuestion();
  } catch (error) {
    console.error('Failed to initialize exam:', error);
    error.value = 'Failed to start exam. Please try again.';
  }
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

    // If this was the last question, clear timer
    if (response.examCompleted) {
      clearTimer();
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

// Watch for timer completion
watch(isTimeUp, async (newValue) => {
  if (newValue) {
    console.log('Timer completed, handling exam submission...');
    await handleTimeUp();
  }
});

// Handle time up function
const handleTimeUp = async () => {
  try {
    isSubmitting.value = true;
    const examSessionId = localStorage.getItem('examSessionId');

    if (!examSessionId) {
      console.error('No exam session ID found');
      navigateTo('/');
      return;
    }

    // Submit current answer if selected
    if (selectedAnswer.value && currentQuestion.value) {
      await $fetch('/api/exam/submit-answer', {
        method: 'POST',
        body: {
          examSessionId,
          questionId: currentQuestion.value.id,
          answerId: selectedAnswer.value,
        },
      });
    }

    // Complete the exam
    const response = await $fetch('/api/exam/complete', {
      method: 'POST',
      body: {
        examSessionId,
        timeExpired: true,
      },
    });

    if (response.success) {
      clearTimer();
      await navigateTo('/student/results');
    }
  } catch (err) {
    console.error('Failed to handle time up:', err);
    error.value = 'Failed to submit exam. Please contact support.';
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div class="max-w-3xl mx-auto px-4 py-8">
    <!-- Timer Component -->
    <ExamTimer :minutes="timerMinutes" @time-up="handleTimeUp" class="mb-6" />

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
