import { defineEventHandler, H3Event } from 'h3';
import prisma from '../../../utils/prisma';

interface UpdateQuestionRequest {
  title: string;
  category: string;
  difficulty: string;
  explanation?: string;
  answers: Array<{
    id?: string;
    text: string;
    isCorrect: boolean;
  }>;
  deletedAnswerIds?: string[];
}

export default defineEventHandler(async (event: H3Event) => {
  try {
    const questionId = getRouterParam(event, 'id');
    const body = await readBody<UpdateQuestionRequest>(event);

    if (!questionId) {
      throw createError({
        statusCode: 400,
        message: 'Question ID is required',
      });
    }

    // Update in transaction to ensure all operations succeed or fail together
    const updatedQuestion = await prisma.$transaction(async (tx) => {
      // Update question
      const question = await tx.question.update({
        where: { id: questionId },
        data: {
          title: body.title,
          category: body.category,
          difficulty: body.difficulty,
          explanation: body.explanation,
          updatedAt: new Date(),
        },
      });

      // Delete removed answers if any
      if (body.deletedAnswerIds?.length) {
        await tx.answer.deleteMany({
          where: {
            id: {
              in: body.deletedAnswerIds,
            },
          },
        });
      }

      // Update/create answers
      const answersToUpsert = body.answers.map((answer) => ({
        id: answer.id || undefined, // undefined for new answers
        text: answer.text,
        isCorrect: answer.isCorrect,
        questionId: questionId,
      }));

      // Delete all existing answers not in the update
      await tx.answer.deleteMany({
        where: {
          questionId,
          id: {
            notIn: answersToUpsert
              .filter((a) => a.id)
              .map((a) => a.id as string),
          },
        },
      });

      // Upsert answers
      for (const answer of answersToUpsert) {
        await tx.answer.upsert({
          where: {
            id: answer.id || 'new', // 'new' for non-existing answers
          },
          create: {
            text: answer.text,
            isCorrect: answer.isCorrect,
            questionId: questionId,
          },
          update: {
            text: answer.text,
            isCorrect: answer.isCorrect,
          },
        });
      }

      return question;
    });

    return {
      success: true,
      question: updatedQuestion,
    };
  } catch (error: any) {
    console.error('Failed to update question:', error);
    throw createError({
      statusCode: error.code === 'P2025' ? 404 : 500,
      message: error.message || 'Failed to update question',
    });
  }
});
