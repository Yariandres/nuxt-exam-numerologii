<script setup lang="ts">
const supabase = useSupabaseClient();
const route = useRoute();
const router = useRouter();

definePageMeta({
  layout: 'admin',
});

const questionId = route.params.id as string;

const isLoading = ref(true);
const isSubmitting = ref(false);
const error = ref('');

// Form state
const question = ref({
  id: '',
  title: '',
  category: '',
  difficulty: '',
  explanation: '',
  active: true,
  answers: [] as Array<{
    id: string;
    text: string;
    isCorrect: boolean;
  }>,
});

const formErrors = ref({
  title: '',
  category: '',
  difficulty: '',
  explanation: '',
  answers: '',
});

const generateCuid = () => {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 15);
  return `c${timestamp}${randomStr}`;
};

// Available options (same as new question form)
const categories = [
  'Wstęp do numerologii ',
  'Dzień urodzenia',
  'Kryształ życia',
  'Wibracje główne ',
  'Podwibracje',
  'Liczby magiczne',
  'Liczby Mistrzowskie',
  'Liczby wibracyjne',
  'Wyznaczniki karmiczne',
  'Horoskop',
  'Biznes',
  'Podpis',
  'Numrologia Dziecięca',
];
const difficulties = ['Easy', 'Medium', 'Hard'];

// Track deleted answer IDs
const deletedAnswerIds = ref<string[]>([]);

// Fetch question data
const fetchQuestion = async () => {
  try {
    // Fetch question
    const { data: questionData, error: questionError } = await supabase
      .from('Question')
      .select('*')
      .eq('id', questionId)
      .single();

    if (questionError) throw questionError;

    // Fetch answers
    const { data: answersData, error: answersError } = await supabase
      .from('Answer')
      .select('*')
      .eq('questionId', questionId);

    if (answersError) throw answersError;

    // Populate form
    question.value = {
      ...questionData,
      answers: answersData || [],
    };
  } catch (err) {
    console.error('Error fetching question:', err);
    error.value = 'Failed to load question';
  } finally {
    isLoading.value = false;
  }
};

// Validate form (same as new question form)
const validateForm = () => {
  let isValid = true;
  formErrors.value = {
    title: '',
    category: '',
    difficulty: '',
    explanation: '',
    answers: '',
  };

  console.log('Validating form with values:', {
    title: question.value.title,
    category: question.value.category,
    difficulty: question.value.difficulty,
    explanation: question.value.explanation,
    answersCount: question.value.answers.length,
  });

  if (!question.value.title) {
    console.log('Title validation failed');
    formErrors.value.title = 'Title is required';
    isValid = false;
  }

  if (!question.value.category) {
    console.log('Category validation failed');
    formErrors.value.category = 'Category is required';
    isValid = false;
  }

  if (!question.value.difficulty) {
    console.log('Difficulty validation failed');
    formErrors.value.difficulty = 'Difficulty is required';
    isValid = false;
  }

  // Check if there are at least 2 answers
  if (question.value.answers.length < 2) {
    console.log('Answers count validation failed');
    formErrors.value.answers = 'At least two answers are required';
    isValid = false;
  }

  // Check if there is exactly one correct answer
  const correctAnswersCount = question.value.answers.filter(
    (a) => a.isCorrect
  ).length;
  if (correctAnswersCount !== 1) {
    console.log('Correct answer validation failed');
    formErrors.value.answers = 'Exactly one answer must be marked as correct';
    isValid = false;
  }

  // Check if all answers have text
  const emptyAnswers = question.value.answers.some((a) => !a.text.trim());
  if (emptyAnswers) {
    console.log('Answer text validation failed');
    formErrors.value.answers = 'All answers must have text';
    isValid = false;
  }

  console.log('Validation result:', { isValid, formErrors: formErrors.value });
  return isValid;
};

// Delete answer
const deleteAnswer = async (index: number) => {
  const answer = question.value.answers[index];

  // If it's an existing answer (has an ID), track it for deletion
  if (answer.id) {
    deletedAnswerIds.value.push(answer.id);
  }

  // Remove from UI
  question.value.answers.splice(index, 1);
};

// Add new answer
const addAnswer = () => {
  question.value.answers.push({
    id: '',
    text: '',
    isCorrect: false,
  });
};

// Update handleSubmit to handle deleted answers
const handleSubmit = async () => {
  console.log('Starting form submission...'); // Debug submission start

  if (!validateForm()) {
    console.log('Form validation failed'); // Debug validation
    return;
  }

  isSubmitting.value = true;
  error.value = '';

  try {
    console.log('Updating question:', {
      id: questionId,
      title: question.value.title,
      category: question.value.category,
      difficulty: question.value.difficulty,
      explanation: question.value.explanation,
    }); // Debug question data

    // Update question
    const { error: questionError } = await supabase
      .from('Question')
      .update({
        title: question.value.title,
        category: question.value.category,
        difficulty: question.value.difficulty,
        explanation: question.value.explanation,
        updatedAt: new Date().toISOString(),
      })
      .eq('id', questionId);

    if (questionError) {
      console.error('Error updating question:', questionError); // Debug question error
      throw questionError;
    }

    console.log('Question updated successfully'); // Debug question success

    // Delete removed answers
    if (deletedAnswerIds.value.length > 0) {
      console.log('Deleting answers:', deletedAnswerIds.value); // Debug deletions

      const { error: deleteError } = await supabase
        .from('Answer')
        .delete()
        .in('id', deletedAnswerIds.value);

      if (deleteError) {
        console.error('Error deleting answers:', deleteError); // Debug deletion error
        throw deleteError;
      }

      console.log('Answers deleted successfully'); // Debug deletion success
    }

    // Update remaining answers and add new ones
    const answersToUpsert = question.value.answers.map((answer) => ({
      id: answer.id || generateCuid(),
      text: answer.text,
      isCorrect: answer.isCorrect,
      questionId: questionId,
    }));

    console.log('Upserting answers:', answersToUpsert); // Debug upsert data

    const { error: answersError } = await supabase
      .from('Answer')
      .upsert(answersToUpsert);

    if (answersError) {
      console.error('Error upserting answers:', answersError); // Debug upsert error
      throw answersError;
    }

    console.log('Answers updated successfully'); // Debug upsert success

    // Redirect to dashboard
    console.log('Redirecting to dashboard...'); // Debug redirect
    await router.push('/admin/dashboard');
  } catch (err) {
    console.error('Error updating question:', err); // Detailed error logging
    error.value = `Failed to update question: ${err.message}`;
  } finally {
    isSubmitting.value = false;
  }
};

// Load question data on mount
onMounted(() => {
  fetchQuestion();
});
</script>

<template>
  <div class="min-h-screen py-8">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-2xl font-bold text-gray-300">Edit Question</h1>
        <UButton
          to="/admin/dashboard"
          color="gray"
          variant="ghost"
          icon="i-heroicons-arrow-left"
        >
          Back
        </UButton>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex justify-center py-12">
        <UIcon name="i-heroicons-arrow-path" class="animate-spin h-8 w-8" />
      </div>

      <!-- Error State -->
      <div
        v-else-if="error"
        class="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700"
      >
        {{ error }}
      </div>

      <!-- Edit Form -->
      <form
        v-else
        @submit.prevent="handleSubmit"
        class="shadow rounded-lg p-6 space-y-6 ring-2 ring-gray-200"
      >
        <!-- Question Title -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-1">
            Question Title
          </label>
          <UInput v-model="question.title" type="text" size="xl" />
        </div>

        <!-- Category & Difficulty -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-1">
              Category
            </label>
            <USelectMenu
              v-model="question.category"
              :options="categories"
              size="xl"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-1">
              Difficulty
            </label>
            <USelectMenu
              v-model="question.difficulty"
              :options="difficulties"
              size="xl"
            />
          </div>
        </div>

        <!-- Answers -->
        <div>
          <div class="flex justify-between items-center mb-2">
            <label class="block text-sm font-medium text-gray-300">
              Answers
            </label>
            <UButton
              @click="addAnswer"
              color="gray"
              variant="ghost"
              icon="i-heroicons-plus-circle"
              size="sm"
            >
              Add Answer
            </UButton>
          </div>
          <div class="space-y-3">
            <div
              v-for="(answer, index) in question.answers"
              :key="answer.id || index"
              class="flex items-center gap-3"
            >
              <UInput
                v-model="answer.text"
                type="text"
                :placeholder="`Answer ${index + 1}`"
                class="w-full"
                size="xl"
              />

              <UCheckbox
                v-model="answer.isCorrect"
                label="Correct"
                @change="
                  if (answer.isCorrect) {
                    question.answers.forEach((a, i) => {
                      if (i !== index) a.isCorrect = false;
                    });
                  }
                "
              />
              <UButton
                @click="deleteAnswer(index)"
                color="red"
                variant="ghost"
                icon="i-heroicons-trash"
                size="sm"
                :disabled="question.answers.length <= 2"
                class="flex-shrink-0"
              />
            </div>
          </div>
          <!-- Validation Error -->
          <p
            v-if="question.answers.length < 2"
            class="mt-1 text-sm text-red-600"
          >
            At least two answers are required
          </p>
        </div>

        <!-- Explanation -->
        <div v-if="question.explanation">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Explanation
          </label>
          <textarea
            v-model="question.explanation"
            rows="3"
            class="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <!-- Submit Button -->
        <div class="flex justify-end">
          <button
            :disabled="isSubmitting"
            class="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            {{ isSubmitting ? 'Saving Changes...' : 'Save Changes' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
