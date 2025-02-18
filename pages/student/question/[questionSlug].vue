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
  <div class="min-h-screen bg-gray-900 relative overflow-hidden">
    <!-- Animated Background -->
    <div class="absolute inset-0 overflow-hidden">
      <!-- Large Numbers (fewer than index page) -->
      <div
        v-for="n in 10"
        :key="`large-${n}`"
        class="absolute text-gray-800/5 font-bold animate-float"
        :style="{
          fontSize: `${Math.random() * 80 + 40}px`,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 5}s`,
          animationDuration: `${Math.random() * 10 + 10}s`,
        }"
      >
        {{ Math.floor(Math.random() * 9) + 1 }}
      </div>

      <!-- Small Numbers (fewer and more transparent) -->
      <div
        v-for="n in 20"
        :key="`small-${n}`"
        class="absolute text-gray-800/3 animate-pulse"
        :style="{
          fontSize: `${Math.random() * 16 + 8}px`,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 3}s`,
          animationDuration: `${Math.random() * 4 + 2}s`,
        }"
      >
        {{ Math.floor(Math.random() * 9) + 1 }}
      </div>

      <!-- Stars (subtle) -->
      <div
        v-for="n in 30"
        :key="`star-${n}`"
        class="absolute bg-white rounded-full animate-twinkle"
        :style="{
          width: `${Math.random() * 2 + 1}px`,
          height: `${Math.random() * 2 + 1}px`,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 5}s`,
          animationDuration: `${Math.random() * 3 + 2}s`,
          opacity: Math.random() * 0.3 + 0.1,
        }"
      />
    </div>

    <!-- Main Content with backdrop blur -->
    <div class="relative z-10 max-w-3xl mx-auto px-4 py-12">
      <!-- Progress Indicator -->
      <div class="mb-4 text-right text-gray-400 text-lg font-medium">
        Question {{ progress }}
      </div>

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
        class="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-lg"
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
      <div v-else-if="currentQuestion" class="space-y-8">
        <!-- Question Header -->
        <div class="space-y-4">
          <span
            class="inline-block px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-600"
          >
            {{ currentQuestion.category }}
          </span>
          <h1
            class="text-2xl md:text-3xl font-bold text-gray-100 leading-relaxed text-balance"
          >
            {{ currentQuestion.title }}
          </h1>
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
              class="flex-1 p-6 border rounded-lg cursor-pointer transition-colors text-lg leading-relaxed"
              :class="{
                'bg-emerald-600 border-emerald-200 text-white':
                  selectedAnswer === answer.id,
                'hover:bg-gray-500 text-gray-100': selectedAnswer !== answer.id,
              }"
            >
              <input
                type="radio"
                :id="answer.id"
                :value="answer.id"
                v-model="selectedAnswer"
                class="mr-4"
                @change="handleAnswerSelect(answer.id)"
              />
              {{ answer.text }}
            </label>
          </div>
        </div>

        <!-- Submit Button -->
        <div class="flex justify-end pt-4">
          <UButton
            @click="submitAnswer"
            :loading="isSubmitting"
            :disabled="!selectedAnswer || isSubmitting"
            color="primary"
            size="lg"
            icon="i-heroicons-arrow-right"
            class="text-lg px-6 py-3"
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
  </div>
</template>

<style scoped>
@keyframes float {
  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-15px) rotate(3deg);
  }
}

@keyframes twinkle {
  0%,
  100% {
    opacity: 0.1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-float {
  animation: float linear infinite;
}

.animate-twinkle {
  animation: twinkle ease-in-out infinite;
}

/* Enhanced card styling */
.rounded-lg {
  @apply backdrop-blur-sm bg-opacity-95;
}

/* Improved focus states */
input[type='radio']:focus + label {
  @apply ring-2 ring-offset-2 ring-emerald-500;
}

/* Enhanced shadows for better depth */
.shadow-lg {
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.2),
    0 8px 10px -6px rgba(0, 0, 0, 0.1);
}

/* Ensure content is readable */
.bg-gray-800 {
  @apply bg-opacity-95 backdrop-blur-sm;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .space-y-8 {
    @apply space-y-6;
  }

  label {
    @apply p-4;
  }
}

/* Dark mode optimizations */
@media (prefers-color-scheme: dark) {
  .bg-gray-800 {
    @apply bg-opacity-95;
  }
}
</style>
