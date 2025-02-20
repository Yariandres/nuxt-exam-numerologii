import { defineEventHandler, H3Event } from 'h3';
import prisma from '../../utils/prisma';

interface InitializeExamRequest {
  studentName: string;
  studentEmail: string;
}

export default defineEventHandler(async (event: H3Event) => {
  try {
    const body = await readBody<InitializeExamRequest>(event);

    if (!body.studentName || !body.studentEmail) {
      throw createError({
        statusCode: 400,
        message: 'Student name and email are required',
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
      orderBy: {
        id: 'asc',
      },
    });

    if (questions.length < 30) {
      throw createError({
        statusCode: 500,
        message:
          'Insufficient questions available for exam (minimum 30 required)',
      });
    }

    console.log('Before randomization - Total questions:', questions.length);
    console.log(
      'Question IDs:',
      questions.map((q) => q.id)
    );

    // Create a copy, randomize, and take only 30 questions
    const randomizedQuestions = [...questions]
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value)
      .slice(0, 30);

    console.log(
      'After randomization - Total questions:',
      randomizedQuestions.length
    );
    console.log(
      'Randomized Question IDs:',
      randomizedQuestions.map((q) => q.id)
    );

    // Create the exam questions array first
    const examQuestions = randomizedQuestions.map((question, index) => ({
      questionId: question.id,
      order: index,
    }));

    console.log('Exam questions to create:', examQuestions.length);

    // Create new exam session
    const examSession = await prisma.examSession.create({
      data: {
        studentName: body.studentName,
        userEmail: body.studentEmail,
        totalQuestions: 30,
        questions: {
          create: examQuestions,
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
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    console.log(
      'Created exam session questions:',
      examSession.questions.length
    );
    console.log(
      'Question slugs:',
      examSession.questions.map((q) => q.question.slug)
    );

    return {
      id: examSession.id,
      questionSlugs: examSession.questions.map((q) => q.question.slug),
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
