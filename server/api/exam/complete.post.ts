import prisma from '~/server/utils/prisma';

export default defineEventHandler(async (event) => {
  console.log('Starting exam completion process...');

  try {
    const body = await readBody(event);
    console.log('Request body:', body);

    const { examSessionId, timeExpired } = body;

    // Validate input
    if (!examSessionId) {
      console.error('Missing examSessionId');
      throw createError({
        statusCode: 400,
        message: 'examSessionId is required',
      });
    }

    // Log attempt to find session
    console.log('Looking for exam session:', examSessionId);

    // Check if exam session exists
    const existingSession = await prisma.examSession.findUnique({
      where: { id: examSessionId },
    });

    console.log('Existing session:', existingSession);

    if (!existingSession) {
      console.error('Session not found:', examSessionId);
      throw createError({
        statusCode: 404,
        message: 'Exam session not found',
      });
    }

    // Check if exam is already completed
    if (existingSession.completedAt) {
      console.log('Exam already completed:', examSessionId);
      return {
        success: true,
        message: 'Exam was already completed',
      };
    }

    console.log('Updating session with completion data...');

    // Update exam session as completed
    const updatedSession = await prisma.examSession.update({
      where: {
        id: examSessionId,
      },
      data: {
        completedAt: new Date(),
        timeExpired: timeExpired || false,
      },
    });

    console.log('Exam completed successfully:', {
      examSessionId,
      timeExpired,
      completedAt: updatedSession.completedAt,
    });

    return {
      success: true,
      message: 'Exam completed successfully',
    };
  } catch (error: any) {
    console.error('Failed to complete exam:', {
      error: error,
      message: error.message,
      stack: error.stack,
    });

    // Return more specific error messages
    if (error.statusCode === 404) {
      throw createError({
        statusCode: 404,
        message: 'Exam session not found',
      });
    }

    throw createError({
      statusCode: 500,
      message: `Failed to complete exam: ${error.message}`,
    });
  }
});
