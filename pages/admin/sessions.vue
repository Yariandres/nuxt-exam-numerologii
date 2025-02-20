<script setup lang="ts">
const supabase = useSupabaseClient();

definePageMeta({
  layout: 'admin',
});

interface ExamSession {
  id: string;
  studentName: string;
  userEmail: string;
  startedAt: string;
  score: number | null;
  passed: boolean | null;
}

const isLoading = ref(true);
const sessions = ref<ExamSession[]>([]);
const error = ref('');

// Add pagination state
const currentPage = ref(1);
const pageSize = ref(20);
const totalSessions = ref(0);

const fetchSessions = async () => {
  try {
    isLoading.value = true;

    const response = await $fetch('/api/admin/sessions', {
      query: {
        page: currentPage.value,
        pageSize: pageSize.value,
      },
    });

    sessions.value = response.sessions;
    totalSessions.value = response.totalCount;
  } catch (err) {
    console.error('Error fetching sessions:', err);
    error.value = 'Failed to load exam sessions';
  } finally {
    isLoading.value = false;
  }
};

// Pagination controls
const totalPages = computed(() =>
  Math.ceil(totalSessions.value / pageSize.value)
);

const changePage = async (page: number) => {
  currentPage.value = page;
  await fetchSessions();
};

// Format date
const formatDate = (date: string) => {
  return new Date(date).toLocaleString('pl-PL');
};

// Load sessions on mount
onMounted(() => {
  fetchSessions();
});
</script>

<template>
  <div class="min-h-screen">
    <!-- Header -->
    <header class="shadow">
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h1 class="text-3xl font-bold text-gray-100">Exam Sessions</h1>
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

      <!-- Sessions Table -->
      <div
        v-else
        class="shadow ring-2 ring-gray-200 rounded-lg overflow-hidden"
      >
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-800">
            <tr>
              <th
                v-for="header in [
                  'Name',
                  'Email',
                  'Started At',
                  'Score',
                  'Status',
                ]"
                :key="header"
                class="px-6 py-3 text-left text-xs font-medium text-gray-100 uppercase tracking-wider"
              >
                {{ header }}
              </th>
            </tr>
          </thead>
          <tbody class="bg-gray-900 divide-y divide-gray-200">
            <tr v-for="session in sessions" :key="session.id">
              <td class="px-6 py-4 whitespace-nowrap text-gray-100">
                {{ session.studentName }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-gray-100">
                {{ session.userEmail }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-gray-100">
                {{ formatDate(session.startedAt) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-gray-100">
                {{
                  session.score ? `${(session.score * 100).toFixed(0)}%` : '-'
                }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  v-if="session.passed !== null"
                  :class="
                    session.passed
                      ? 'bg-green-500 text-green-100'
                      : 'bg-red-500 text-red-100'
                  "
                  class="px-2 py-1 text-xs font-medium rounded-full"
                >
                  {{ session.passed ? 'Passed' : 'Failed' }}
                </span>
                <span v-else class="text-gray-400">In Progress</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination Controls -->
      <div class="mt-4 flex justify-center gap-2">
        <UButton
          v-for="page in totalPages"
          :key="page"
          :variant="currentPage === page ? 'solid' : 'ghost'"
          @click="changePage(page)"
        >
          {{ page }}
        </UButton>
      </div>

      <!-- Sessions count -->
      <div class="mt-4 text-center text-sm text-gray-500">
        Total Sessions: {{ totalSessions }}
      </div>
    </main>
  </div>
</template>
