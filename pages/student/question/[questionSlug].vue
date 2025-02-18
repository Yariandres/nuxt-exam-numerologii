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

// State management
const currentQuestion = ref<Question | null>(null);
const selectedAnswer = ref<string>('');
const isLoading = ref(true);
const error = ref('');
const isSubmitting = ref(false);
const questionSlugs = ref<string[]>([]);
const currentQuestionIndex = ref(0);

// Computed properties
const progress = computed(() => {
  if (!questionSlugs.value.length) return 0;
  return `${currentQuestionIndex.value + 1} / ${questionSlugs.value.length}`;
});

// State management functions
const resetExamState = () => {
  currentQuestion.value = null;
  selectedAnswer.value = '';
  currentQuestionIndex.value = 0;
  questionSlugs.value = [];
};

// Lifecycle hooks
onMounted(async () => {
  resetExamState();

  const examSessionId = localStorage.getItem('examSessionId');
  const storedSlugs = localStorage.getItem('questionSlugs');

  if (!examSessionId || !storedSlugs) {
    localStorage.clear();
    navigateTo('/');
    return;
  }

  try {
    questionSlugs.value = JSON.parse(storedSlugs);
    currentQuestionIndex.value = questionSlugs.value.findIndex(
      (slug) => slug === route.params.questionSlug
    );

    if (currentQuestionIndex.value === -1) {
      navigateTo('/');
      return;
    }

    await initializeTimer(() => handleTimeUp());
    await fetchQuestion();
  } catch (error) {
    error.value = 'Failed to start exam. Please try again.';
  }
});

// API calls
const fetchQuestion = async () => {
  try {
    isLoading.value = true;
    const question = await $fetch<Question>(
      `/api/exam/questions/${route.params.questionSlug}`
    );
    currentQuestion.value = question;
  } catch (err) {
    error.value = 'Failed to load question. Please try again.';
  } finally {
    isLoading.value = false;
  }
};

// Event handlers
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
      navigateTo('/');
      return;
    }

    await $fetch('/api/exam/submit-answer', {
      method: 'POST',
      body: {
        examSessionId,
        questionId: currentQuestion.value.id,
        answerId: selectedAnswer.value,
      },
    });

    selectedAnswer.value = '';

    const isLastQuestion =
      currentQuestionIndex.value === questionSlugs.value.length - 1;
    if (isLastQuestion) {
      clearTimer();
      localStorage.removeItem('questionSlugs');
      await navigateTo('/student/results');
      return;
    }

    const nextSlug = questionSlugs.value[currentQuestionIndex.value + 1];
    if (nextSlug) {
      await router.push(`/student/question/${nextSlug}`);
    } else {
      await navigateTo('/student/results');
    }
  } catch (err) {
    error.value = 'Failed to submit answer. Please try again.';
  } finally {
    isSubmitting.value = false;
  }
};

const handleTimeUp = async () => {
  try {
    isSubmitting.value = true;
    const examSessionId = localStorage.getItem('examSessionId');

    if (!examSessionId) {
      navigateTo('/');
      return;
    }

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

    const response = await $fetch('/api/exam/complete', {
      method: 'POST',
      body: {
        examSessionId,
        timeExpired: true,
      },
    });

    if (response.success) {
      clearTimer();
      localStorage.removeItem('questionSlugs');
      await navigateTo('/student/results');
    }
  } catch (err) {
    error.value = 'Failed to submit exam. Please contact support.';
  } finally {
    isSubmitting.value = false;
  }
};

// Watchers
watch(
  () => route.params.questionSlug,
  () => {
    selectedAnswer.value = '';
  }
);
</script>

<template>
  <div class="max-w-3xl mx-auto px-4 py-8">
    <!-- Progress Indicator -->
    <div class="mb-4 text-right text-gray-600">Question {{ progress }}</div>

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
          {{
            currentQuestionIndex === questionSlugs.length - 1
              ? 'Finish Exam'
              : 'Next Question'
          }}
        </UButton>
      </div>
    </div>
  </div>
</template>
