<script setup lang="ts">
definePageMeta({
  layout: 'student',
});
interface FailedQuestion {
  title: string;
  userAnswer: string;
  correctAnswer: string;
  explanation: string;
}

interface ExamResult {
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  passed: boolean;
  failedQuestions: FailedQuestion[];
  timeExpired: boolean;
}

const examResult = ref<ExamResult | null>(null);
const isLoading = ref(true);
const error = ref('');
const isDownloading = ref(false);

// Share URLs configuration
const shareUrls = computed(() => {
  if (!examResult.value?.passed) return null;

  const shareText = encodeURIComponent(
    `I just passed my Numerology Certification Exam with a score of ${Math.round(
      examResult.value.score * 100
    )}%! 🎉`
  );
  const shareUrl = encodeURIComponent(window.location.origin);

  return {
    twitter: `https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}&quote=${shareText}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}&summary=${shareText}`,
    whatsapp: `https://wa.me/?text=${shareText}%20${shareUrl}`,
  };
});

const shareToSocial = (platform: string) => {
  if (!shareUrls.value) return;

  const url = shareUrls.value[platform as keyof typeof shareUrls.value];
  window.open(url, '_blank', 'width=600,height=400');
};

onMounted(async () => {
  const examSessionId = localStorage.getItem('examSessionId');
  if (!examSessionId) {
    navigateTo('/');
    return;
  }

  try {
    const response = await $fetch<ExamResult>(
      `/api/exam/results/${examSessionId}`
    );
    examResult.value = response;
  } catch (err) {
    console.error('Failed to fetch results:', err);
    error.value = 'Failed to load exam results';
  } finally {
    isLoading.value = false;
  }
});

const retakeExam = async () => {
  localStorage.removeItem('examSessionId');
  await navigateTo('/');
};

const downloadCertificate = async () => {
  const examSessionId = localStorage.getItem('examSessionId');
  if (!examSessionId) return;

  isDownloading.value = true;
  try {
    // Fetch certificate as blob
    const response = await $fetch(`/api/exam/certificate/${examSessionId}`, {
      responseType: 'blob',
    });

    // Create blob URL and trigger download
    const blob = new Blob([response], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `numerology-certificate-${examSessionId}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.error('Failed to download certificate:', err);
    error.value = 'Failed to download certificate. Please try again.';
  } finally {
    isDownloading.value = false;
  }
};

const exitExam = async () => {
  // Clear all exam data
  localStorage.removeItem('examSessionId');
  localStorage.removeItem('studentName');
  // Navigate to home page
  await navigateTo('/');
};
</script>

<template>
  <div class="max-w-3xl mx-auto px-4 py-8">
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
      <UButton size="sm" color="red" variant="ghost" @click="retakeExam">
        Start New Exam
      </UButton>
    </div>

    <!-- Results Display -->
    <div v-else-if="examResult" class="space-y-8">
      <!-- Result Header -->
      <div
        class="p-6 rounded-lg"
        :class="examResult.passed ? 'bg-green-600' : 'bg-red-600'"
      >
        <h1 class="text-3xl font-bold mb-4">
          {{ examResult.passed ? 'Congratulations!' : 'Exam Not Passed' }}
        </h1>
        <div class="text-lg">
          <p class="mb-2">
            Score: {{ Math.round(examResult.score * 100) }}% ({{
              examResult.correctAnswers
            }}/{{ examResult.totalQuestions }})
          </p>
          <p v-if="examResult.passed">
            You have successfully passed the Numerology Certification Exam!
          </p>
          <p v-else>
            Unfortunately, you did not achieve the passing score. You can retake
            the exam immediately.
          </p>
        </div>
      </div>

      <div v-if="examResult?.timeExpired" class="text-red-600 mb-4">
        Note: Exam was automatically submitted due to time expiration.
      </div>

      <!-- Action Buttons and Share Options -->
      <div class="flex flex-col space-y-4">
        <div class="flex justify-between">
          <UButton
            v-if="!examResult.passed"
            @click="retakeExam"
            color="primary"
            icon="i-heroicons-arrow-path"
          >
            Retake Exam
          </UButton>
          <div v-if="examResult.passed" class="flex space-x-4">
            <UButton
              @click="downloadCertificate"
              :loading="isDownloading"
              :disabled="isDownloading"
              color="primary"
              icon="i-heroicons-document-arrow-down"
            >
              {{
                isDownloading
                  ? 'Generating Certificate...'
                  : 'Download Certificate'
              }}
            </UButton>
            <UButton
              @click="exitExam"
              color="gray"
              icon="i-heroicons-arrow-left-circle"
            >
              Exit Exam
            </UButton>
          </div>
        </div>

        <!-- Social Share Buttons (Only show when passed) -->
        <div v-if="examResult.passed" class="flex flex-col space-y-2">
          <p class="text-center text-gray-600 font-medium">
            Share your achievement!
          </p>
          <div class="flex justify-center space-x-4">
            <!-- Twitter -->
            <UButton
              @click="shareToSocial('twitter')"
              color="gray"
              variant="ghost"
              class="group"
            >
              <UIcon
                name="i-simple-icons-twitter"
                class="w-6 h-6 text-[#1DA1F2] group-hover:scale-110 transition-transform"
              />
            </UButton>

            <!-- Facebook -->
            <UButton
              @click="shareToSocial('facebook')"
              color="gray"
              variant="ghost"
              class="group"
            >
              <UIcon
                name="i-simple-icons-facebook"
                class="w-6 h-6 text-[#4267B2] group-hover:scale-110 transition-transform"
              />
            </UButton>

            <!-- LinkedIn -->
            <UButton
              @click="shareToSocial('linkedin')"
              color="gray"
              variant="ghost"
              class="group"
            >
              <UIcon
                name="i-simple-icons-linkedin"
                class="w-6 h-6 text-[#0A66C2] group-hover:scale-110 transition-transform"
              />
            </UButton>

            <!-- WhatsApp -->
            <UButton
              @click="shareToSocial('whatsapp')"
              color="gray"
              variant="ghost"
              class="group"
            >
              <UIcon
                name="i-simple-icons-whatsapp"
                class="w-6 h-6 text-[#25D366] group-hover:scale-110 transition-transform"
              />
            </UButton>
          </div>
        </div>
      </div>

      <!-- Failed Questions Review -->
      <div v-if="examResult.failedQuestions.length > 0" class="mt-8">
        <h2 class="text-xl font-semibold mb-4">Questions to Review</h2>
        <div class="space-y-6">
          <div
            v-for="(question, index) in examResult.failedQuestions"
            :key="index"
            class="p-6 rounded-lg border"
          >
            <h3 class="font-medium mb-2">{{ question.title }}</h3>
            <div class="space-y-2 text-sm">
              <p class="text-red-600">Your answer: {{ question.userAnswer }}</p>
              <p class="text-green-600">
                Correct answer: {{ question.correctAnswer }}
              </p>
              <p
                v-if="question.explanation"
                class="mt-4 text-gray-600 bg-gray-50 p-3 rounded"
              >
                {{ question.explanation }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.group {
  @apply transition-colors duration-200;
}

.group:hover {
  @apply bg-gray-100;
}
</style>
