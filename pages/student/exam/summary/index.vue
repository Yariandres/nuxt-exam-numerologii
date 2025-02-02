<script setup lang="ts">
import { useExamStore } from '~/stores/examStore';
const examStore = useExamStore();

// Handle retake exam
const handleRetakeExam = () => {
  examStore.resetExam();
  navigateTo('/');
};
</script>

<template>
  <ExamSummary
    :exam-result="examStore.examResult"
    @retake-exam="handleRetakeExam"
  />
</template>
