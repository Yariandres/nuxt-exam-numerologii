import { defineEventHandler, H3Event } from 'h3';
import prisma from '../../../utils/prisma';

export default defineEventHandler(async (event: H3Event) => {
  try {
    const query = getQuery(event);
    const page = Number(query.page) || 1;
    const pageSize = Number(query.pageSize) || 20;

    // Get total count
    const totalCount = await prisma.examSession.count();

    // Fetch paginated sessions
    const sessions = await prisma.examSession.findMany({
      orderBy: {
        startedAt: 'desc',
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        id: true,
        studentName: true,
        userEmail: true,
        startedAt: true,
        score: true,
        passed: true,
      },
    });

    return {
      sessions,
      totalCount,
      page,
      pageSize,
    };
  } catch (error: any) {
    console.error('Failed to fetch sessions:', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch exam sessions',
    });
  }
});
