import prisma from '../../utils/prisma';

export default defineEventHandler(async (event) => {
  try {
    await prisma.$connect();

    if (event.method === 'GET') {
      const settings = await prisma.examSettings.findFirst();
      return settings || { timerMinutes: 30 };
    }

    if (event.method === 'PUT') {
      const body = await readBody(event);

      if (!body.timerMinutes || typeof body.timerMinutes !== 'number') {
        throw createError({
          statusCode: 400,
          message: 'Invalid timer minutes value',
        });
      }

      const settings = await prisma.examSettings.upsert({
        where: { id: 'default' },
        update: { timerMinutes: body.timerMinutes },
        create: { id: 'default', timerMinutes: body.timerMinutes },
      });

      return settings;
    }

    throw createError({
      statusCode: 405,
      message: 'Method not allowed',
    });
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Internal server error',
    });
  } finally {
    await prisma.$disconnect();
  }
});
