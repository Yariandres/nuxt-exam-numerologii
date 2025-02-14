import { defineEventHandler, H3Event } from 'h3';
import prisma from '../../../utils/prisma';

export default defineEventHandler(async (event: H3Event) => {
  try {
    const slug = getRouterParam(event, 'slug');

    const question = await prisma.question.findUnique({
      where: { slug },
      include: {
        answers: {
          select: {
            id: true,
            text: true,
            // Note: isCorrect is not included in select
          },
        },
      },
    });

    if (!question) {
      throw createError({
        statusCode: 404,
        message: 'Question not found',
      });
    }

    return question;
  } catch (error) {
    console.error('Failed to fetch question:', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch question',
    });
  }
});
