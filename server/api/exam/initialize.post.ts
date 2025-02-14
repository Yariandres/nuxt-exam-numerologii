import { defineEventHandler, H3Event } from 'h3';
import prisma from '../../utils/prisma';

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
      // Limit to exactly 30 questions
      take: 30,
    });

    if (questions.length === 0) {
      throw createError({
        statusCode: 500,
        message: 'No questions available',
      });
    }

    // Randomize questions array
    const randomizedQuestions = [...questions].sort(() => Math.random() - 0.5);

    // Create new exam session with ordered questions
    const examSession = await prisma.examSession.create({
      data: {
        studentName: body.studentName,
        totalQuestions: randomizedQuestions.length,
        questions: {
          create: randomizedQuestions.map((question, index) => ({
            questionId: question.id,
            order: index,
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

    // Sort questions by order before returning
    const sortedQuestions = examSession.questions.sort(
      (a, b) => (a.order || 0) - (b.order || 0)
    );

    return {
      id: examSession.id,
      questionSlugs: sortedQuestions.map((q) => q.question.slug),
      totalQuestions: examSession.totalQuestions,
      currentQuestion: 0,
    };
  } catch (error: any) {
    console.error('Failed to initialize exam:', error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to initialize exam',
    });
  }
});
