import { defineStore } from 'pinia';

interface Question {
  id: string;
  slug: string;
  title: string;
  answers: Answer[];
  explanation: string;
}

interface Answer {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface ExamSession {
  id: string;
  questionSlugs: string[];
  totalQuestions: number;
}

interface ExamResult {
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  passed: boolean;
  failedQuestions: FailedQuestion[];
}

interface FailedQuestion {
  title: string;
  userAnswer: string;
  correctAnswer: string;
  explanation: string;
}

export const useExamStore = defineStore('exam', () => {
  // State
  const currentQuestionIndex = ref(0);
  const selectedAnswer = ref<string | null>(null);
  const isAnswerSubmitted = ref(false);
  const examCompleted = ref(false);
  const examSession = ref<ExamSession | null>(null);
  const currentQuestion = ref<Question | null>(null);
  const examResult = ref<ExamResult>({
    totalQuestions: 0,
    correctAnswers: 0,
    score: 0,
    passed: false,
    failedQuestions: [],
  });

  // Actions
  const initializeExam = async () => {
    try {
      // 1. Get a new exam session from the server
      const response = await $fetch('/api/exam/initialize', {
        method: 'POST',
        body: {
          studentName: localStorage.getItem('studentName'),
        },
      });

      examSession.value = response as ExamSession;
      examResult.value.totalQuestions = examSession.value.totalQuestions;

      // 2. Fetch first question
      await fetchQuestion(examSession.value.questionSlugs[0]);
    } catch (error) {
      console.error('Failed to initialize exam:', error);
      throw error;
    }
  };

  const fetchQuestion = async (slug: string) => {
    try {
      // Fetch single question data
      const question = await $fetch(`/api/exam/questions/${slug}`);
      currentQuestion.value = question as Question;
    } catch (error) {
      console.error('Failed to fetch question:', error);
      throw error;
    }
  };

  const submitAnswer = async () => {
    if (!selectedAnswer.value || !currentQuestion.value || !examSession.value)
      return;

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

    // Check if this is the last question
    if (currentQuestionIndex.value === examSession.value.totalQuestions - 1) {
      const score =
        examResult.value.correctAnswers / examResult.value.totalQuestions;
      examResult.value.score = score;
      examResult.value.passed = score >= 0.5; // 50% passing threshold
      examCompleted.value = true;

      // Submit final results to server
      await $fetch('/api/exam/submit', {
        method: 'POST',
        body: {
          examSessionId: examSession.value.id,
          result: examResult.value,
        },
      });
    }
  };

  const goToNextQuestion = async () => {
    if (!examSession.value) return;

    if (currentQuestionIndex.value < examSession.value.totalQuestions - 1) {
      currentQuestionIndex.value++;
      selectedAnswer.value = null;
      isAnswerSubmitted.value = false;

      // Fetch next question
      const nextSlug =
        examSession.value.questionSlugs[currentQuestionIndex.value];
      await fetchQuestion(nextSlug);
    }
  };

  const resetExam = () => {
    currentQuestionIndex.value = 0;
    selectedAnswer.value = null;
    isAnswerSubmitted.value = false;
    examCompleted.value = false;
    examSession.value = null;
    currentQuestion.value = null;
    examResult.value = {
      totalQuestions: 0,
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
    currentQuestion,
    examSession,

    // Actions
    initializeExam,
    submitAnswer,
    goToNextQuestion,
    resetExam,
  };
});
