import { defineStore } from 'pinia';
import questionsData from '~/composables/questionsData';

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
}

export const useExamStore = defineStore('exam', () => {
  // State
  const currentQuestionIndex = ref(0);
  const selectedAnswer = ref<string | null>(null);
  const isAnswerSubmitted = ref(false);
  const examCompleted = ref(false);
  const examResult = ref<ExamResult>({
    totalQuestions: questionsData.length,
    correctAnswers: 0,
    score: 0,
    passed: false,
    failedQuestions: [],
  });

  // Getters
  const currentQuestion = computed(() => {
    return questionsData[currentQuestionIndex.value];
  });

  const isLastQuestion = computed(() => {
    return currentQuestionIndex.value === questionsData.length - 1;
  });

  // Actions
  const submitAnswer = () => {
    if (selectedAnswer.value) {
      isAnswerSubmitted.value = true;

      const question = currentQuestion.value;
      const selectedAnswerObj = question.answers.find(
        (a) => a.id === selectedAnswer.value
      );

      if (selectedAnswerObj?.isCorrect) {
        examResult.value.correctAnswers++;
      } else {
        examResult.value.failedQuestions.push({
          title: question.title,
          userAnswer: selectedAnswerObj?.text || '',
          correctAnswer: question.answers.find((a) => a.isCorrect)?.text || '',
          explanation: question.explanation,
        });
      }

      if (isLastQuestion.value) {
        const score = examResult.value.correctAnswers / questionsData.length;
        examResult.value.score = score;
        examResult.value.passed = score >= 0.5; // 50% passing threshold
        examCompleted.value = true;
      }
    }
  };

  const goToNextQuestion = () => {
    if (!isLastQuestion.value) {
      currentQuestionIndex.value++;
      selectedAnswer.value = null;
      isAnswerSubmitted.value = false;
    }
  };

  const resetExam = () => {
    currentQuestionIndex.value = 0;
    selectedAnswer.value = null;
    isAnswerSubmitted.value = false;
    examCompleted.value = false;
    examResult.value = {
      totalQuestions: questionsData.length,
      correctAnswers: 0,
      score: 0,
      passed: false,
      failedQuestions: [],
    };
  };

  return {
    // State
    currentQuestionIndex,
    selectedAnswer,
    isAnswerSubmitted,
    examCompleted,
    examResult,

    // Getters
    currentQuestion,
    isLastQuestion,

    // Actions
    submitAnswer,
    goToNextQuestion,
    resetExam,
  };
});
