import { questions } from '~/composables/questionsData';

export const useTest = () => {
  return {
    ...questions,
    questions: questions.map((question) => ({
      ...question,
      path: `/student/question/${question.slug}`,
    })),
  };
};
