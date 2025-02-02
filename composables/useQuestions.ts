import questions from '~/composables/questionsData';

export const useQuestions = () => {
  return {
    questions: questions.map((data: any) => ({
      ...data,
      path: `/student/exam/${data.slug}`,
    })),
  };
};
