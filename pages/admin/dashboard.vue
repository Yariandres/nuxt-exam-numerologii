<script setup lang="ts">
const supabase = useSupabaseClient();
const { categories } = useCategories();

definePageMeta({
  layout: 'admin',
});

const isLoading = ref(true);
const questions = ref<any[]>([]);
const error = ref('');

// Add pagination state
const currentPage = ref(1);
const pageSize = ref(20); // Number of questions per page
const totalQuestions = ref(0);

// Add new ref for search
const searchQuery = ref('');

// Add new ref for category filter
const selectedCategory = ref('');

// Get unique categories from questions
const availableCategories = computed(() => {
  return categories.sort();
});

// Modified filtered questions computation
const filteredQuestions = computed(() => {
  let filtered = questions.value;

  // Apply title search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter((question) =>
      question.title.toLowerCase().includes(query)
    );
  }

  // Apply category filter
  if (selectedCategory.value) {
    filtered = filtered.filter(
      (question) => question.category === selectedCategory.value
    );
  }

  return filtered;
});

// Update totalPages to use filtered questions length
const totalPages = computed(() =>
  Math.ceil(filteredQuestions.value.length / pageSize.value)
);

// Modified fetch questions
const fetchQuestions = async () => {
  try {
    isLoading.value = true;

    // Get total count
    const { count } = await supabase
      .from('Question')
      .select('*', { count: 'exact', head: true });

    totalQuestions.value = count || 0;

    // Fetch all questions for client-side filtering
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

// Update pagination to use filtered questions
const paginatedQuestions = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredQuestions.value.slice(start, end);
});

// Modified changePage function
const changePage = (page: number) => {
  currentPage.value = page;
  // No need to fetch questions again as we're filtering client-side
};

// Reset pagination when filters change
watch([searchQuery, selectedCategory], () => {
  currentPage.value = 1;
});

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
    const response = await useFetch(`/api/questions/${questionId}`, {
      method: 'DELETE',
    });

    if (response.error.value) {
      throw response.error.value;
    }

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
      <!-- Search and Filter Section -->
      <div class="mb-6 space-y-4 sm:space-y-0 sm:flex sm:gap-4">
        <!-- Title Search -->
        <UInput
          v-model="searchQuery"
          placeholder="Search questions by title..."
          icon="i-heroicons-magnifying-glass"
          size="lg"
          class="w-full sm:w-2/3"
        />

        <!-- Category Filter -->
        <USelect
          v-model="selectedCategory"
          :options="availableCategories"
          placeholder="Filter by category"
          size="lg"
          class="w-full sm:w-1/3"
          clearable
        >
          <template #option="{ option }">
            <span class="truncate">{{ option }}</span>
          </template>
        </USelect>
      </div>

      <!-- Active Filters Display -->
      <div
        v-if="selectedCategory || searchQuery"
        class="mb-4 flex flex-wrap gap-2"
      >
        <UBadge v-if="searchQuery" color="gray" class="flex items-center gap-1">
          Search: {{ searchQuery }}
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-x-mark"
            size="xs"
            @click="searchQuery = ''"
          />
        </UBadge>
        <UBadge
          v-if="selectedCategory"
          color="gray"
          class="flex items-center gap-1"
        >
          Category: {{ selectedCategory }}
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-x-mark"
            size="xs"
            @click="selectedCategory = ''"
          />
        </UBadge>
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

      <!-- Questions List -->
      <div v-else>
        <!-- No Results Message -->
        <div
          v-if="filteredQuestions.length === 0"
          class="text-center py-12 text-gray-500"
        >
          No questions found matching your criteria.
          <UButton
            v-if="searchQuery || selectedCategory"
            color="gray"
            variant="ghost"
            class="ml-2"
            @click="
              () => {
                searchQuery = '';
                selectedCategory = '';
              }
            "
          >
            Clear filters
          </UButton>
        </div>

        <div v-else class="shadow rounded-lg ring-2 ring-gray-200">
          <ul class="divide-y divide-gray-200">
            <li
              v-for="question in paginatedQuestions"
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
                <h3 class="text-sm font-medium text-gray-500 mt-2">
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
                    question.active
                      ? 'i-heroicons-eye-slash'
                      : 'i-heroicons-eye'
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

        <!-- Pagination Controls -->
        <div v-if="totalPages > 1" class="mt-4 flex justify-center gap-2">
          <UButton
            v-for="page in totalPages"
            :key="page"
            :variant="currentPage === page ? 'solid' : 'ghost'"
            @click="changePage(page)"
          >
            {{ page }}
          </UButton>
        </div>

        <!-- Update Questions count -->
        <div class="mt-4 text-center text-sm text-gray-500">
          Showing {{ paginatedQuestions.length }} of
          {{ filteredQuestions.length }} questions
        </div>
      </div>
    </main>
  </div>
</template>
