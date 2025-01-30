import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useTestStore = defineStore('test', () => {
  const test = useTest();
  const currentQuestionIndex = ref(0);
  const selectedAnswers = ref<any[]>([]);
  const isTestComplete = ref(false);
  const passingScore = 50;

  const currentQuestion = computed(
    () => test.questions[currentQuestionIndex.value]
  );
  const currentAnswers = computed(() => currentQuestion.value?.answers || []);

  // Updated examResults to work with new submission structure
  const examResults = computed(() => {
    const total = test.questions.length;
    const correct = selectedAnswers.value.filter(
      (answer: any) => answer.isCorrect
    ).length;
    const incorrect = total - correct;
    const percentage = Math.round((correct / total) * 100);
    const isPassed = percentage >= passingScore;

    return {
      total,
      correct,
      incorrect,
      percentage,
      isPassed,
    };
  });

  const isLastQuestion = computed(() => {
    return currentQuestionIndex.value === test.questions.length - 1;
  });

  function selectAnswer(submission: any) {
    selectedAnswers.value[currentQuestionIndex.value] = submission;
  }

  function previousQuestion() {
    if (currentQuestionIndex.value > 0) {
      currentQuestionIndex.value--;
    }
  }

  function nextQuestion() {
    if (currentQuestionIndex.value < test.questions.length - 1) {
      currentQuestionIndex.value++;
    } else {
      isTestComplete.value = true;
      navigateTo('/student/summary');
    }
  }

  function resetTest() {
    currentQuestionIndex.value = 0;
    selectedAnswers.value = [];
    isTestComplete.value = false;
  }

  async function generateCertificate() {
    try {
      // TODO: Implement PDF generation logic
      console.log('Generating certificate...', selectedAnswers.value);
    } catch (error) {
      console.error('Error generating certificate:', error);
    }
  }

  return {
    currentQuestionIndex,
    selectedAnswers,
    isTestComplete,
    currentQuestion,
    currentAnswers,
    examResults,
    selectAnswer,
    previousQuestion,
    nextQuestion,
    resetTest,
    generateCertificate,
    isLastQuestion,
  };
});
