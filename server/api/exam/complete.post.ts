import prisma from '~/server/utils/prisma';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { examSessionId, timeExpired } = body;

  try {
    // Update exam session as completed
    await prisma.examSession.update({
      where: { id: examSessionId },
      data: {
        completed: true,
        timeExpired: timeExpired || false,
        completedAt: new Date(),
      },
    });

    return { success: true };
  } catch (error) {
    console.error('Failed to complete exam:', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to complete exam',
    });
  }
});
