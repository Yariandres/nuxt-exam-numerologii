import { defineEventHandler, H3Event } from 'h3';
import prisma from '~/server/utils/prisma';

interface InitializeExamRequest {
  studentName: string;
}

export default defineEventHandler(async (event: H3Event) => {
  try {
    const body = await readBody<InitializeExamRequest>(event);

    if (!body.studentName) {
      throw createError({
        statusCode: 400,
        message: 'Student name is required',
      });
    }

    // Get all active questions
    const questions = await prisma.question.findMany({
      where: {
        active: true,
      },
      select: {
        id: true,
        slug: true,
      },
      // Get 30 random questions
      take: 30,
      orderBy: {
        // Random ordering in Postgres
        createdAt: 'asc',
      },
    });

    if (questions.length === 0) {
      throw createError({
        statusCode: 500,
        message: 'No questions available',
      });
    }

    // Create new exam session with questions
    const examSession = await prisma.examSession.create({
      data: {
        studentName: body.studentName,
        totalQuestions: questions.length,
        questions: {
          create: questions.map((question) => ({
            questionId: question.id,
          })),
        },
      },
      include: {
        questions: {
          include: {
            question: {
              select: {
                slug: true,
              },
            },
          },
        },
      },
    });

    return {
      id: examSession.id,
      questionSlugs: examSession.questions.map((q) => q.question.slug),
      totalQuestions: examSession.totalQuestions,
    };
  } catch (error) {
    console.error('Failed to initialize exam:', error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to initialize exam',
    });
  }
});
