import { defineEventHandler, H3Event } from 'h3';
import prisma from '../../../utils/prisma';

export default defineEventHandler(async (event: H3Event) => {
  try {
    const examSessionId = getRouterParam(event, 'examSessionId');

    if (!examSessionId) {
      throw createError({
        statusCode: 400,
        message: 'Exam session ID is required',
      });
    }

    // Get exam session with questions and answers
    const examSession = await prisma.examSession.findUnique({
      where: { id: examSessionId },
      include: {
        questions: {
          include: {
            question: {
              include: {
                answers: true,
              },
            },
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

    // Calculate results
    const totalQuestions = examSession.totalQuestions;
    let correctAnswers = 0;
    const failedQuestions = [];

    for (const examQuestion of examSession.questions) {
      const question = examQuestion.question;
      const userAnswer = examQuestion.userAnswer;
      const correctAnswer = question.answers.find((a) => a.isCorrect);

      if (userAnswer === correctAnswer?.id) {
        correctAnswers++;
      } else {
        failedQuestions.push({
          title: question.title,
          userAnswer:
            question.answers.find((a) => a.id === userAnswer)?.text ||
            'No answer',
          correctAnswer: correctAnswer?.text || 'Unknown',
          explanation: question.explanation,
        });
      }
    }

    const score = correctAnswers / totalQuestions;
    const passed = score >= 0.5; // Changed from 0.7 to 0.5 for 50% passing threshold

    // Update exam session with final results
    await prisma.examSession.update({
      where: { id: examSessionId },
      data: {
        completedAt: new Date(),
        score,
        passed,
      },
    });

    return {
      totalQuestions,
      correctAnswers,
      score,
      passed,
      failedQuestions,
    };
  } catch (error: any) {
    console.error('Failed to get exam results:', error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to get exam results',
    });
  }
});
