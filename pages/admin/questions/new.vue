<script setup lang="ts">
import { useCategories } from '@/composables/useCategories';

const router = useRouter();
const supabase = useSupabaseClient();

definePageMeta({
  layout: 'admin',
});

const isSubmitting = ref(false);
const error = ref('');

// Form state
const question = ref({
  title: '',
  category: '',
  difficulty: '',
  explanation: '',
  answers: [
    { text: '', isCorrect: false },
    { text: '', isCorrect: false },
    { text: '', isCorrect: false },
    { text: '', isCorrect: false },
  ],
});

// Validation state
const formErrors = ref({
  title: '',
  category: '',
  difficulty: '',
  explanation: '',
  answers: '',
});

// Replace the categories array with the composable
const { categories } = useCategories();
const difficulties = ['Easy', 'Medium', 'Hard'];

// Generate CUID (you can move this to a utility function)
const generateCuid = () => {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 15);
  return `c${timestamp}${randomStr}`;
};

// Validate form
const validateForm = () => {
  let isValid = true;
  formErrors.value = {
    title: '',
    category: '',
    difficulty: '',
    explanation: '',
    answers: '',
  };

  if (!question.value.title.trim()) {
    formErrors.value.title = 'Question title is required';
    isValid = false;
  }

  if (!question.value.category) {
    formErrors.value.category = 'Category is required';
    isValid = false;
  }

  if (!question.value.difficulty) {
    formErrors.value.difficulty = 'Difficulty is required';
    isValid = false;
  }

  if (!question.value.explanation.trim()) {
    formErrors.value.explanation = 'Explanation is required';
    isValid = false;
  }

  // Validate answers
  const filledAnswers = question.value.answers.filter((a) => a.text.trim());
  const correctAnswers = question.value.answers.filter((a) => a.isCorrect);

  if (filledAnswers.length < 2) {
    formErrors.value.answers = 'At least two answers are required';
    isValid = false;
  }

  if (correctAnswers.length !== 1) {
    formErrors.value.answers = 'Exactly one correct answer must be selected';
    isValid = false;
  }

  return isValid;
};

// Handle form submission
const handleSubmit = async () => {
  if (!validateForm()) return;

  isSubmitting.value = true;
  error.value = '';

  try {
    // Generate slug from title
    const slug = question.value.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Generate CUID for the question
    const questionId = generateCuid();

    // First, create the question with explicit ID
    const { data: questionData, error: questionError } = await supabase
      .from('Question')
      .insert([
        {
          id: questionId, // Explicitly set the ID
          title: question.value.title,
          slug,
          category: question.value.category,
          difficulty: question.value.difficulty,
          explanation: question.value.explanation,
          active: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (questionError) throw questionError;

    // Then create the answers using the question ID
    const validAnswers = question.value.answers
      .filter((a) => a.text.trim())
      .map((a) => ({
        id: generateCuid(), // Generate CUID for each answer
        text: a.text,
        isCorrect: a.isCorrect,
        questionId: questionId,
      }));

    const { error: answersError } = await supabase
      .from('Answer')
      .insert(validAnswers);

    if (answersError) throw answersError;

    // Redirect to dashboard
    router.push('/admin/dashboard');
  } catch (err: any) {
    console.error('Error creating question:', err);
    error.value =
      err?.message || 'Failed to create question. Please try again.';
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen py-8">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-2xl font-bold text-gray-100">Add New Question</h1>
        <UButton
          to="/admin/dashboard"
          color="gray"
          variant="ghost"
          icon="i-heroicons-arrow-left"
        >
          Back
        </UButton>
      </div>

      <!-- Form -->
      <form
        @submit.prevent="handleSubmit"
        class="shadow rounded-lg p-6 space-y-6 ring-2 ring-gray-200"
      >
        <!-- Error Message -->
        <div
          v-if="error"
          class="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700"
        >
          {{ error }}
        </div>

        <!-- Question Title -->
        <div>
          <label class="block text-sm font-medium text-gray-100 mb-1">
            Question Title
          </label>
          <UInput
            v-model="question.title"
            type="text"
            :class="{ 'border-red-300': formErrors.title }"
          />
          <p v-if="formErrors.title" class="mt-1 text-sm text-red-600">
            {{ formErrors.title }}
          </p>
        </div>

        <!-- Category & Difficulty -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-100 mb-1">
              Category
            </label>
            <select
              v-model="question.category"
              class="w-full rounded-lg border-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500 ring-2 ring-gray-200 px-3 py-2"
              :class="{ 'border-red-300': formErrors.category }"
            >
              <option value="">Select Category</option>
              <option
                v-for="category in categories"
                :key="category"
                :value="category"
              >
                {{ category }}
              </option>
            </select>
            <p v-if="formErrors.category" class="mt-1 text-sm text-red-600">
              {{ formErrors.category }}
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-100 mb-1">
              Difficulty
            </label>
            <select
              v-model="question.difficulty"
              class="w-full rounded-lg border-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500 ring-2 ring-gray-200 px-3 py-2"
              :class="{ 'border-red-300': formErrors.difficulty }"
            >
              <option value="">Select Difficulty</option>
              <option v-for="level in difficulties" :key="level" :value="level">
                {{ level }}
              </option>
            </select>
            <p v-if="formErrors.difficulty" class="mt-1 text-sm text-red-600">
              {{ formErrors.difficulty }}
            </p>
          </div>
        </div>

        <!-- Answers -->
        <div>
          <label class="block text-sm font-medium text-gray-100 mb-2">
            Answers
          </label>
          <div class="space-y-3">
            <div
              v-for="(answer, index) in question.answers"
              :key="index"
              class="flex items-center gap-3"
            >
              <input
                v-model="answer.text"
                type="text"
                :placeholder="`Answer ${index + 1}`"
                class="flex-1 rounded-lg border-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500 ring-2 ring-gray-200 px-3 py-2"
              />
              <UCheckbox
                v-model="answer.isCorrect"
                :disabled="
                  answer.isCorrect &&
                  question.answers.filter((a) => a.isCorrect).length === 1
                "
                label="Correct"
                @change="
                  if (answer.isCorrect) {
                    question.answers.forEach((a, i) => {
                      if (i !== index) a.isCorrect = false;
                    });
                  }
                "
              />
            </div>
          </div>
          <p v-if="formErrors.answers" class="mt-1 text-sm text-red-600">
            {{ formErrors.answers }}
          </p>
        </div>

        <!-- Explanation -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Explanation
          </label>
          <textarea
            v-model="question.explanation"
            rows="3"
            class="w-full rounded-lg border-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500 ring-2 ring-gray-200 px-3 py-2"
            :class="{ 'border-red-300': formErrors.explanation }"
          />
          <p v-if="formErrors.explanation" class="mt-1 text-sm text-red-600">
            {{ formErrors.explanation }}
          </p>
        </div>

        <!-- Submit Button -->
        <div class="flex justify-end">
          <UButton
            type="submit"
            :loading="isSubmitting"
            :disabled="isSubmitting"
            color="primary"
          >
            {{ isSubmitting ? 'Creating Question...' : 'Create Question' }}
          </UButton>
        </div>
      </form>
    </div>
  </div>
</template>
