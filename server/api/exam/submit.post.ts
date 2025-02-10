import { defineEventHandler, H3Event } from 'h3';
import prisma from '~/server/utils/prisma';

interface SubmitExamRequest {
  examSessionId: string;
  result: {
    totalQuestions: number;
    correctAnswers: number;
    score: number;
    passed: boolean;
    failedQuestions: Array<{
      title: string;
      userAnswer: string;
      correctAnswer: string;
      explanation: string;
    }>;
  };
}

export default defineEventHandler(async (event: H3Event) => {
  try {
    const body = await readBody<SubmitExamRequest>(event);

    if (!body.examSessionId || !body.result) {
      throw createError({
        statusCode: 400,
        message: 'Invalid submission data',
      });
    }

    // Update exam session with results
    const updatedSession = await prisma.examSession.update({
      where: {
        id: body.examSessionId,
      },
      data: {
        completedAt: new Date(),
        score: body.result.score,
        passed: body.result.passed,
      },
    });

    return {
      success: true,
      message: updatedSession.passed
        ? 'Congratulations! You have passed the exam.'
        : 'Unfortunately, you did not pass the exam. You can try again.',
      result: body.result,
    };
  } catch (error) {
    console.error('Failed to submit exam:', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to submit exam results',
    });
  }
});
