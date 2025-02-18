import { supabase } from '~/utils/supabase';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { examSessionId, timeExpired } = body;

    if (!examSessionId) {
      throw createError({
        statusCode: 400,
        message: 'examSessionId is required',
      });
    }

    // Check if exam exists
    const { data: existingExam, error: checkError } = await supabase
      .from('exam_sessions')
      .select('completedAt')
      .eq('id', examSessionId)
      .single();

    if (checkError) throw checkError;

    if (!existingExam) {
      throw createError({
        statusCode: 404,
        message: 'Exam session not found',
      });
    }

    if (existingExam.completedAt) {
      return {
        success: true,
        message: 'Exam was already completed',
      };
    }

    // Update exam session
    const { error: updateError } = await supabase
      .from('exam_sessions')
      .update({
        completedAt: new Date().toISOString(),
        timeExpired: timeExpired || false,
      })
      .eq('id', examSessionId);

    if (updateError) throw updateError;

    return {
      success: true,
      message: 'Exam completed successfully',
    };
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      message: `Failed to complete exam: ${error.message}`,
    });
  }
});
