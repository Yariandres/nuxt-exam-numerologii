<script setup lang="ts">
import { ref } from 'vue';

definePageMeta({
  layout: 'admin',
});

interface Answer {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface Question {
  id: string;
  slug: string;
  title: string;
  answers: Answer[];
  category: string;
  difficulty: string;
  active: boolean;
}

// Mock data for questions
const questions = ref<Question[]>([
  {
    id: 'q1',
    slug: 'life-path-number-september-15-1985',
    title:
      'What is the Life Path number for someone born on September 15, 1985?',
    answers: [
      { id: 'a1', text: '7', isCorrect: false },
      { id: 'a2', text: '1', isCorrect: true },
      { id: 'a3', text: '9', isCorrect: false },
      { id: 'a4', text: '5', isCorrect: false },
    ],
    category: 'life-path',
    difficulty: 'beginner',
    active: true,
  },
  // ... more questions
]);

// State for new/edit question form
const showForm = ref(false);
const isEditing = ref(false);
const currentQuestion = ref<Question | null>(null);

const newQuestion = ref({
  title: '',
  category: '',
  difficulty: 'beginner',
  answers: [
    { id: '1', text: '', isCorrect: false },
    { id: '2', text: '', isCorrect: false },
    { id: '3', text: '', isCorrect: false },
    { id: '4', text: '', isCorrect: false },
  ],
});

const difficulties = ['beginner', 'intermediate', 'advanced'];
const categories = [
  'life-path',
  'destiny-number',
  'soul-urge',
  'personality-number',
];

// CRUD Operations
const addQuestion = () => {
  showForm.value = true;
  isEditing.value = false;
  resetForm();
};

const editQuestion = (question: Question) => {
  currentQuestion.value = question;
  newQuestion.value = { ...question };
  showForm.value = true;
  isEditing.value = true;
};

const deleteQuestion = (id: string) => {
  if (confirm('Are you sure you want to delete this question?')) {
    questions.value = questions.value.filter((q) => q.id !== id);
  }
};

const saveQuestion = () => {
  if (isEditing.value && currentQuestion.value) {
    const index = questions.value.findIndex(
      (q) => q.id === currentQuestion.value?.id
    );
    questions.value[index] = {
      ...newQuestion.value,
      id: currentQuestion.value.id,
    };
  } else {
    const id = `q${questions.value.length + 1}`;
    questions.value.push({ ...newQuestion.value, id, active: true });
  }
  showForm.value = false;
  resetForm();
};

const resetForm = () => {
  newQuestion.value = {
    title: '',
    category: '',
    difficulty: 'beginner',
    answers: [
      { id: '1', text: '', isCorrect: false },
      { id: '2', text: '', isCorrect: false },
      { id: '3', text: '', isCorrect: false },
      { id: '4', text: '', isCorrect: false },
    ],
  };
  currentQuestion.value = null;
};

const toggleQuestionStatus = (question: Question) => {
  question.active = !question.active;
};

// Add new function for exporting questions
const exportQuestions = () => {
  const questionsData = questions.value.map((q) => ({
    ...q,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));

  const dataStr = JSON.stringify(questionsData, null, 2);
  const dataUri =
    'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

  const exportFileDefaultName = `numerology-questions-${
    new Date().toISOString().split('T')[0]
  }.json`;

  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
  linkElement.remove();
};

// Add new function for importing questions
const importQuestions = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const importedQuestions = JSON.parse(e.target?.result as string);

      // Validate imported questions format
      if (
        Array.isArray(importedQuestions) &&
        importedQuestions.every(
          (q) =>
            q.title &&
            q.answers &&
            Array.isArray(q.answers) &&
            q.answers.length === 4 &&
            q.category &&
            q.difficulty
        )
      ) {
        // Add new questions to the existing list
        questions.value = [
          ...questions.value,
          ...importedQuestions.map((q) => ({
            ...q,
            id: `q${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, // Generate unique ID
            active: true,
          })),
        ];
        alert('Questions imported successfully!');
      } else {
        alert('Invalid file format. Please check the JSON structure.');
      }
    } catch (error) {
      alert('Error importing questions. Please check the file format.');
    }
  };
  reader.readAsText(file);

  // Reset the input
  (event.target as HTMLInputElement).value = '';
};
</script>

<template>
  <div class="min-h-screen bg-pink-100 p-8">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Question Management</h1>
          <p class="mt-2 text-gray-600">Add, edit, or remove test questions</p>
        </div>
        <div class="flex space-x-4">
          <!-- Import/Export Buttons -->
          <div class="flex space-x-2">
            <label
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
            >
              Import Questions
              <UInput
                type="file"
                accept=".json"
                class="hidden"
                @change="importQuestions"
                size="sm"
                icon="i-heroicons-arrow-up-tray"
              />
            </label>
            <UButton
              @click="exportQuestions"
              color="blue"
              size="sm"
              icon="i-heroicons-arrow-down-tray"
            >
              Export Questions
            </UButton>
          </div>
          <!-- Existing Add Question Button -->
          <UButton
            @click="addQuestion"
            color="green"
            size="sm"
            icon="i-heroicons-plus"
          >
            Add New Question
          </UButton>
        </div>
      </div>

      <!-- Questions Table -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
              >
                Title
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
              >
                Category
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
              >
                Difficulty
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
              >
                Status
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="question in questions" :key="question.id">
              <td class="px-6 py-4">
                <div class="text-sm text-gray-900">{{ question.title }}</div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-500">{{ question.category }}</div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-500">
                  {{ question.difficulty }}
                </div>
              </td>
              <td class="px-6 py-4">
                <button
                  @click="toggleQuestionStatus(question)"
                  :class="[
                    'px-2 py-1 text-xs font-medium rounded-full',
                    question.active
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800',
                  ]"
                >
                  {{ question.active ? 'Active' : 'Inactive' }}
                </button>
              </td>
              <td class="px-6 py-4">
                <div class="flex space-x-3">
                  <button
                    @click="editQuestion(question)"
                    class="text-indigo-600 hover:text-indigo-900"
                  >
                    Edit
                  </button>
                  <button
                    @click="deleteQuestion(question.id)"
                    class="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Add/Edit Question Modal -->
      <div
        v-if="showForm"
        class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full"
      >
        <div
          class="relative top-20 mx-auto p-5 border w-full max-w-3xl shadow-lg rounded-md bg-white"
        >
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-medium text-gray-900">
              {{ isEditing ? 'Edit Question' : 'Add New Question' }}
            </h3>
            <UButton
              @click="showForm = false"
              color="indigo"
              size="sm"
              icon="i-heroicons-x-mark"
            >
              <span class="sr-only">Close</span>
            </UButton>
          </div>

          <form @submit.prevent="saveQuestion" class="space-y-4">
            <!-- Question Title -->
            <div>
              <label class="block text-sm font-medium text-gray-700"
                >Question Title</label
              >
              <UInput
                v-model="newQuestion.title"
                type="text"
                required
                size="sm"
              />
            </div>

            <!-- Category & Difficulty -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >Category</label
                >
                <select
                  v-model="newQuestion.category"
                  required
                  class="py-2 m-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >Difficulty</label
                >
                <select
                  v-model="newQuestion.difficulty"
                  required
                  class="py-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option
                    v-for="difficulty in difficulties"
                    :key="difficulty"
                    :value="difficulty"
                  >
                    {{ difficulty }}
                  </option>
                </select>
              </div>
            </div>

            <!-- Answers -->
            <div class="space-y-3">
              <label class="block text-sm font-medium text-gray-700"
                >Answers</label
              >
              <div
                v-for="(answer, index) in newQuestion.answers"
                :key="answer.id"
                class="flex items-center space-x-3"
              >
                <UInput
                  v-model="answer.text"
                  type="text"
                  required
                  :placeholder="`Answer ${index + 1}`"
                  class="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                <input
                  v-model="answer.isCorrect"
                  type="radio"
                  :name="'correct-answer'"
                  class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                />
                <span class="text-sm text-gray-500">Correct</span>
              </div>
            </div>

            <!-- Form Actions -->
            <div class="flex justify-end space-x-3 pt-4">
              <UButton
                type="button"
                @click="showForm = false"
                color="gray"
                size="sm"
                icon="i-heroicons-x-mark"
              >
                Cancel
              </UButton>
              <UButton
                type="submit"
                color="indigo"
                size="sm"
                icon="i-heroicons-check"
              >
                {{ isEditing ? 'Save Changes' : 'Add Question' }}
              </UButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
