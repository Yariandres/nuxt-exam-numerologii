import { defineEventHandler, H3Event, setHeader } from 'h3';
import prisma from '../../../utils/prisma';
import PDFDocument from 'pdfkit';

export default defineEventHandler(async (event: H3Event) => {
  try {
    const examSessionId = getRouterParam(event, 'examSessionId');

    if (!examSessionId) {
      throw createError({
        statusCode: 400,
        message: 'Exam session ID is required',
      });
    }

    // Get exam session with student name and score
    const examSession = await prisma.examSession.findUnique({
      where: { id: examSessionId },
    });

    if (!examSession || !examSession.passed) {
      throw createError({
        statusCode: 404,
        message: 'Certificate not available',
      });
    }

    // Create PDF document
    const doc = new PDFDocument({
      size: 'A4',
      layout: 'landscape',
      margins: {
        top: 40,
        bottom: 40,
        left: 40,
        right: 40,
      },
    });

    // Set response headers for PDF download
    setHeader(event, 'Content-Type', 'application/pdf');
    setHeader(
      event,
      'Content-Disposition',
      `attachment; filename="numerology-certificate-${examSessionId}.pdf"`
    );

    // Certificate design
    doc.font('Helvetica');

    // Border
    doc
      .rect(20, 20, doc.page.width - 40, doc.page.height - 40)
      .strokeColor('#234E70')
      .lineWidth(3)
      .stroke();

    // Header
    doc
      .fontSize(40)
      .fillColor('#234E70')
      .font('Helvetica-Bold')
      .text('Certificate of Completion', 0, 100, {
        align: 'center',
      });

    // Subtitle
    doc
      .fontSize(25)
      .fillColor('#666')
      .font('Helvetica')
      .text('Numerology Certification Exam', 0, 160, {
        align: 'center',
      });

    // Main text
    doc.fontSize(20).fillColor('#333').text('This is to certify that', 0, 220, {
      align: 'center',
    });

    // Student name
    doc
      .fontSize(30)
      .fillColor('#234E70')
      .font('Helvetica-Bold')
      .text(examSession.studentName, 0, 260, {
        align: 'center',
      });

    // Achievement text
    doc
      .fontSize(20)
      .fillColor('#333')
      .font('Helvetica')
      .text(
        'has successfully completed the Numerology Certification Exam\n' +
          `with a score of ${Math.round(examSession.score * 100)}%`,
        0,
        320,
        {
          align: 'center',
        }
      );

    // Date
    const date = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    doc.fontSize(16).text(`Issued on ${date}`, 0, 400, {
      align: 'center',
    });

    // Signature line
    doc
      .moveTo(doc.page.width / 2 - 100, 500)
      .lineTo(doc.page.width / 2 + 100, 500)
      .stroke();

    doc
      .fontSize(14)
      .text('Authorized Signature', doc.page.width / 2 - 100, 510, {
        width: 200,
        align: 'center',
      });

    // Certificate ID
    doc
      .fontSize(12)
      .fillColor('#666')
      .text(`Certificate ID: ${examSessionId}`, 40, doc.page.height - 60, {
        align: 'left',
      });

    // End the document
    doc.end();

    // Stream the PDF directly to the response
    return doc;
  } catch (error) {
    console.error('Failed to generate certificate:', error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to generate certificate',
    });
  }
});
