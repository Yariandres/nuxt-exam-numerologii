import { defineEventHandler, H3Event } from 'h3';
import prisma from '~/server/utils/prisma';
import { Prisma } from '@prisma/client';

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

    // Get 30 random active questions
    const questions = await prisma.question.findMany({
      where: {
        active: true,
      },
      select: {
        id: true,
        slug: true,
      },
      orderBy: {
        // Random ordering in Postgres
        raw: Prisma.sql`RANDOM()`,
      },
      take: 30,
    });

    // Create exam session with questions
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
          select: {
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
      studentName: examSession.studentName,
      startedAt: examSession.startedAt,
    };
  } catch (error) {
    console.error('Failed to initialize exam:', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to initialize exam',
    });
  }
});
