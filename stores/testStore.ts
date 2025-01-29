import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
// TODO: will be fetching from db
import { questions } from '@/questionsData';

interface AnswerSubmission {
  questionId: number;
  question: string;
  selectedAnswer: string;
  isCorrect: boolean;
}

export const useTestStore = defineStore('test', () => {
  const currentQuestionIndex = ref(0);
  const selectedAnswers = ref<AnswerSubmission[]>([]);
  const isTestComplete = ref(false);
  const passingScore = 70;

  const currentQuestion = computed(() => questions[currentQuestionIndex.value]);
  const currentAnswers = computed(() => currentQuestion.value?.answers || []);

  // Updated examResults to work with new submission structure
  const examResults = computed(() => {
    const total = questions.length;
    const correct = selectedAnswers.value.filter(
      (answer) => answer.isCorrect
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
    return currentQuestionIndex.value === questions.length - 1;
  });

  function selectAnswer(submission: AnswerSubmission) {
    selectedAnswers.value[currentQuestionIndex.value] = submission;
  }

  function previousQuestion() {
    if (currentQuestionIndex.value > 0) {
      currentQuestionIndex.value--;
    }
  }

  function nextQuestion() {
    if (currentQuestionIndex.value < questions.length - 1) {
      currentQuestionIndex.value++;
    } else {
      isTestComplete.value = true;
      navigateTo('/student/exam');
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
