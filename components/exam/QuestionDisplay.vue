<script setup lang="ts">
const props = defineProps({
  question: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['answerSelected']);
const selectedAnswer = ref(null);

function isSelected(answer: any) {
  return selectedAnswer.value === answer;
}

function submitAnswer(answer: any) {
  const submission = {
    questionId: props.question.id,
    question: props.question.question,
    selectedAnswer: answer.text,
    isCorrect: answer.isCorrect,
  };

  selectedAnswer.value = answer;
  emit('answerSelected', submission);
}
</script>

<template>
  <div class="p-4 rounded-lg shadow-md">
    <h2 class="text-xl font-semibold mb-4">{{ question.question }}</h2>
    <div class="answers space-y-2">
      <label
        v-for="answer in question.answers"
        :key="answer.text"
        class="flex items-center p-3 border rounded-lg hover:bg-gray-800 cursor-pointer"
        :class="{ 'bg-blue-50 border-blue-500': isSelected(answer) }"
      >
        <input
          type="radio"
          :value="answer"
          v-model="selectedAnswer"
          @change="submitAnswer(answer)"
          class="mr-2"
        />
        <span class="text-lg">{{ answer.text }}</span>
      </label>
    </div>
  </div>
</template>
