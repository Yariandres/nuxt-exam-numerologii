import prisma from '~/server/utils/prisma';

export default defineEventHandler(async (event) => {
  try {
    const questionId = getRouterParam(event, 'id');

    if (!questionId) {
      throw createError({
        statusCode: 400,
        message: 'Question ID is required',
      });
    }

    // First verify the question exists
    const question = await prisma.question.findUnique({
      where: { id: questionId },
    });

    if (!question) {
      throw createError({
        statusCode: 404,
        message: 'Question not found',
      });
    }

    // Delete in transaction to ensure both operations succeed or fail together
    await prisma.$transaction(async (tx) => {
      // Delete ExamQuestion records first
      await tx.examQuestion.deleteMany({
        where: { questionId },
      });

      // Delete associated answers
      await tx.answer.deleteMany({
        where: { questionId },
      });

      // Then delete the question
      await tx.question.delete({
        where: { id: questionId },
      });
    });

    return { success: true };
  } catch (error: any) {
    console.error('Server error deleting question:', error);

    // More specific error messages based on the error type
    if (error.code === 'P2025') {
      throw createError({
        statusCode: 404,
        message: 'Question not found',
      });
    }

    if (error.code === 'P2003') {
      throw createError({
        statusCode: 400,
        message: 'Cannot delete question due to existing references',
      });
    }

    throw createError({
      statusCode: 500,
      message: `Failed to delete question: ${error.message}`,
      cause: error,
    });
  }
});
