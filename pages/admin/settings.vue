<script setup lang="ts">
import { ref } from 'vue';

definePageMeta({
  layout: 'admin',
});

interface TestSettings {
  timeLimit: number;
  questionsPerTest: number;
  passingScore: number;
  randomizeQuestions: boolean;
  showFeedbackImmediately: boolean;
  allowRetake: boolean;
  retakeWaitingPeriod: number;
  categories: {
    [key: string]: {
      name: string;
      enabled: boolean;
      weight: number;
    };
  };
}

// Mock initial settings
const settings = ref<TestSettings>({
  timeLimit: 60, // minutes
  questionsPerTest: 20,
  passingScore: 50, // percentage
  randomizeQuestions: true,
  showFeedbackImmediately: true,
  allowRetake: true,
  retakeWaitingPeriod: 24, // hours
  categories: {
    'life-path': {
      name: 'Life Path Numbers',
      enabled: true,
      weight: 30,
    },
    'destiny-number': {
      name: 'Destiny Numbers',
      enabled: true,
      weight: 25,
    },
    'soul-urge': {
      name: 'Soul Urge Numbers',
      enabled: true,
      weight: 25,
    },
    'personality-number': {
      name: 'Personality Numbers',
      enabled: true,
      weight: 20,
    },
  },
});

// Form state
const isEditing = ref(false);
const tempSettings = ref<TestSettings>({ ...settings.value });

// Computed total weight
const totalWeight = computed(() => {
  return Object.values(tempSettings.value.categories).reduce(
    (sum, category) => sum + (category.enabled ? category.weight : 0),
    0
  );
});

// Methods
const startEditing = () => {
  isEditing.value = true;
  tempSettings.value = JSON.parse(JSON.stringify(settings.value));
};

const cancelEditing = () => {
  isEditing.value = false;
  tempSettings.value = JSON.parse(JSON.stringify(settings.value));
};

const saveSettings = () => {
  // Validate total weight equals 100
  if (totalWeight.value !== 100) {
    alert('Category weights must sum to 100%');
    return;
  }

  settings.value = JSON.parse(JSON.stringify(tempSettings.value));
  isEditing.value = false;
  // Here you would typically save to backend
  alert('Settings saved successfully!');
};
</script>

<template>
  <div class="min-h-screen bg-pink-100 p-8">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Test Settings</h1>
          <p class="mt-2 text-gray-600">Configure exam parameters and rules</p>
        </div>
        <div class="space-x-4">
          <UButton
            v-if="!isEditing"
            @click="startEditing"
            color="blue"
            size="lg"
            icon="i-heroicons-pencil"
          >
          </UButton>
          <template v-else>
            <UButton
              @click="cancelEditing"
              color="red"
              size="lg"
              icon="i-heroicons-x-mark"
            >
            </UButton>
            <UButton
              @click="saveSettings"
              color="green"
              size="lg"
              icon="i-heroicons-check"
            >
            </UButton>
          </template>
        </div>
      </div>

      <!-- Settings Form -->
      <div class="bg-white rounded-lg shadow-sm p-6 space-y-8">
        <!-- General Settings -->
        <div>
          <h2 class="text-lg font-medium text-gray-900 mb-4">
            General Settings
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700">
                Time Limit (minutes)
              </label>
              <UInput
                v-model.number="tempSettings.timeLimit"
                type="number"
                min="1"
                :disabled="!isEditing"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">
                Questions Per Test
              </label>
              <UInput
                v-model.number="tempSettings.questionsPerTest"
                type="number"
                min="1"
                :disabled="!isEditing"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">
                Passing Score (%)
              </label>
              <UInput
                v-model.number="tempSettings.passingScore"
                type="number"
                min="0"
                max="100"
                :disabled="!isEditing"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">
                Retake Waiting Period (hours)
              </label>
              <UInput
                v-model.number="tempSettings.retakeWaitingPeriod"
                type="number"
                min="0"
                :disabled="!isEditing"
              />
            </div>
          </div>

          <!-- Toggle Settings -->
          <div class="mt-6 space-y-4">
            <div class="flex items-center">
              <UCheckbox
                v-model="tempSettings.randomizeQuestions"
                :disabled="!isEditing"
                color="indigo"
              />
              />
              <label class="block text-sm text-gray-900">
                Randomize Question Order
              </label>
            </div>

            <div class="flex items-center">
              <UCheckbox
                v-model="tempSettings.showFeedbackImmediately"
                :disabled="!isEditing"
                color="indigo"
              />
              <label class="ml-2 block text-sm text-gray-900">
                Show Feedback Immediately
              </label>
            </div>

            <div class="flex items-center">
              <UCheckbox
                v-model="tempSettings.allowRetake"
                :disabled="!isEditing"
                color="indigo"
              />
              <label class="ml-2 block text-sm text-gray-900">
                Allow Test Retake
              </label>
            </div>
          </div>
        </div>

        <!-- Category Weights -->
        <div>
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-medium text-gray-900">Category Weights</h2>
            <span
              :class="[
                'text-sm font-medium',
                totalWeight === 100 ? 'text-green-600' : 'text-red-600',
              ]"
            >
              Total: {{ totalWeight }}%
            </span>
          </div>

          <div class="space-y-4">
            <div
              v-for="(category, key) in tempSettings.categories"
              :key="key"
              class="flex items-center space-x-4"
            >
              <UCheckbox v-model="category.enabled" :disabled="!isEditing" />
              <span class="text-sm text-gray-900 w-48">{{
                category.name
              }}</span>
              <UInput
                v-model.number="category.weight"
                type="number"
                min="0"
                max="100"
                :disabled="!isEditing || !category.enabled"
              />
              <span class="text-sm text-gray-500">%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
