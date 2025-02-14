import { defineEventHandler, H3Event } from 'h3';
import prisma from '../../utils/prisma';

interface SubmitAnswerRequest {
  examSessionId: string;
  questionId: string;
  answerId: string;
}

export default defineEventHandler(async (event: H3Event) => {
  try {
    const body = await readBody<SubmitAnswerRequest>(event);

    if (!body.examSessionId || !body.questionId || !body.answerId) {
      throw createError({
        statusCode: 400,
        message: 'Missing required fields',
      });
    }

    // Get the exam session
    const examSession = await prisma.examSession.findUnique({
      where: { id: body.examSessionId },
      include: {
        questions: {
          include: {
            question: true,
          },
        },
      },
    });

    if (!examSession) {
      throw createError({
        statusCode: 404,
        message: 'Exam session not found',
      });
    }

    // Get the current question
    const currentQuestionIndex = examSession.questions.findIndex(
      (q) => q.question.id === body.questionId
    );

    if (currentQuestionIndex === -1) {
      throw createError({
        statusCode: 404,
        message: 'Question not found in exam session',
      });
    }

    // Update the answer in the database
    await prisma.examQuestion.update({
      where: {
        examSessionId_questionId: {
          examSessionId: body.examSessionId,
          questionId: body.questionId,
        },
      },
      data: {
        userAnswer: body.answerId,
        answeredAt: new Date(),
      },
    });

    // Check if this was the last question
    const isLastQuestion =
      currentQuestionIndex === examSession.questions.length - 1;

    if (isLastQuestion) {
      return {
        examCompleted: true,
      };
    }

    // Get next question slug
    const nextQuestion = examSession.questions[currentQuestionIndex + 1];

    return {
      examCompleted: false,
      nextQuestionSlug: nextQuestion.question.slug,
    };
  } catch (error) {
    console.error('Failed to submit answer:', error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to submit answer',
    });
  }
});
