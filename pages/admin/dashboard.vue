<script setup lang="ts">
import type { Question } from '@prisma/client';
const supabase = useSupabaseClient();

const isLoading = ref(true);
const questions = ref<Question[]>([]);
const error = ref('');

// Fetch questions
const fetchQuestions = async () => {
  try {
    isLoading.value = true;
    const { data, error: fetchError } = await supabase
      .from('Question')
      .select('*')
      .order('createdAt', { ascending: false });

    if (fetchError) throw fetchError;
    questions.value = data;
  } catch (err) {
    console.error('Error fetching questions:', err);
    error.value = 'Failed to load questions';
  } finally {
    isLoading.value = false;
  }
};

// Toggle question status
const toggleQuestionStatus = async (
  questionId: string,
  currentStatus: boolean
) => {
  try {
    const { error: updateError } = await supabase
      .from('Question')
      .update({ active: !currentStatus })
      .eq('id', questionId);

    if (updateError) throw updateError;
    await fetchQuestions();
  } catch (err) {
    console.error('Error updating question:', err);
    error.value = 'Failed to update question status';
  }
};

// Delete question
const deleteQuestion = async (questionId: string) => {
  if (!window.confirm('Are you sure you want to delete this question?')) return;

  try {
    // First delete all answers associated with the question
    const { error: answersDeleteError } = await supabase
      .from('Answer')
      .delete()
      .eq('questionId', questionId);

    if (answersDeleteError) throw answersDeleteError;

    // Then delete the question
    const { error: questionDeleteError } = await supabase
      .from('Question')
      .delete()
      .eq('id', questionId);

    if (questionDeleteError) throw questionDeleteError;

    await fetchQuestions();
  } catch (err) {
    console.error('Error deleting question:', err);
    error.value = 'Failed to delete question';
  }
};

// Load questions on mount
onMounted(() => {
  fetchQuestions();
});
</script>

<template>
  <div class="min-h-screen">
    <!-- Header -->
    <header class="shadow">
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center">
          <h1 class="text-3xl font-bold text-gray-100">Question Management</h1>
          <UButton
            to="/admin/questions/new"
            color="primary"
            icon="i-heroicons-plus"
          >
            Add Question
          </UButton>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
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

      <!-- Questions List -->
      <div v-else class="shadow rounded-lg ring-2 ring-gray-200">
        <ul class="divide-y divide-gray-200">
          <li
            v-for="question in questions"
            :key="question.id"
            class="p-4 hover:bg-pink-900 flex items-center justify-between"
          >
            <div class="flex-1 min-w-0 pr-4">
              <div class="flex items-center gap-4">
                <span
                  :class="
                    question.active
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700'
                  "
                  class="px-2 py-1 rounded-full text-xs font-medium"
                >
                  {{ question.active ? 'Active' : 'Inactive' }}
                </span>
                <span
                  class="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700"
                >
                  {{ question.category }}
                </span>
                <span
                  class="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700"
                >
                  {{ question.difficulty }}
                </span>
              </div>
              <h3 class="text-sm font-medium text-gray-50 mt-2">
                {{ question.title }}
              </h3>
            </div>

            <!-- Action Buttons -->
            <div class="flex items-center gap-2">
              <UButton
                :to="`/admin/questions/${question.id}/edit`"
                color="gray"
                variant="ghost"
                icon="i-heroicons-pencil-square"
              >
                Edit
              </UButton>
              <UButton
                @click="toggleQuestionStatus(question.id, question.active)"
                color="gray"
                variant="ghost"
                :icon="
                  question.active ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'
                "
              >
                {{ question.active ? 'Disable' : 'Enable' }}
              </UButton>
              <UButton
                @click="deleteQuestion(question.id)"
                color="red"
                variant="ghost"
                icon="i-heroicons-trash"
              >
                Delete
              </UButton>
            </div>
          </li>
        </ul>
      </div>
    </main>
  </div>
</template>
