import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { GroqService } from '@/lib/groq.service';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('resume') as File;

    if (!file) {
      return NextResponse.json({ error: 'No resume file provided' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({
        error: 'Invalid file type. Please upload PDF, DOC, DOCX, or TXT files.'
      }, { status: 400 });
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({
        error: 'File size too large. Maximum 5MB allowed.'
      }, { status: 400 });
    }

    // Extract text from resume
    const resumeText = await extractTextFromFile(file);

    // Use Groq AI to analyze resume and extract structured information
    const resumeData = await GroqService.analyzeResume(resumeText);

    // Generate interview questions based on resume using Groq
    const questions = await GroqService.generateInterviewQuestions({
      role: 'Software Engineer', // Default role
      objective: 'technical',
      questionCount: 10,
      context: resumeText,
      skills: resumeData.skills
    });

    return NextResponse.json({
      success: true,
      resumeText: resumeText.substring(0, 500) + '...', // Preview
      resumeData,
      questions,
      fileName: file.name
    });

  } catch (error) {
    console.error('Resume upload error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to process resume. Please try again.';
    return NextResponse.json({
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? String(error) : undefined
    }, { status: 500 });
  }
}

async function extractTextFromFile(file: File): Promise<string> {
  try {
    // For plain text files, read directly
    if (file.type === 'text/plain') {
      const text = await file.text();
      if (!text || text.trim().length === 0) {
        throw new Error('The text file appears to be empty.');
      }
      return text;
    }

    // For PDF files
    if (file.type === 'application/pdf') {
      // TODO: In production, use 'pdf-parse' library for proper PDF text extraction
      // For now, attempt to read as text with a warning
      const arrayBuffer = await file.arrayBuffer();
      const text = new TextDecoder().decode(arrayBuffer);

      // Check if we got reasonable text (PDFs have binary data mixed in)
      const cleanText = text.replace(/[^\x20-\x7E\n\r\t]/g, '').trim();

      if (cleanText.length < 50) {
        throw new Error(
          'Unable to extract text from PDF. Please convert to a text file or use a different format. ' +
          'For production use, install pdf-parse package.'
        );
      }

      return cleanText;
    }

    // For DOC/DOCX files
    if (
      file.type === 'application/msword' ||
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      // TODO: In production, use 'mammoth' library for proper DOC/DOCX extraction
      throw new Error(
        'Word document parsing not yet implemented. Please convert to PDF or text format. ' +
        'For production use, install mammoth package.'
      );
    }

    // Fallback for unknown types
    const text = await file.text();
    if (!text || text.trim().length === 0) {
      throw new Error('Unable to extract text from file. Please use a plain text or PDF file.');
    }
    return text;

  } catch (error) {
    console.error('File extraction error:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Unable to extract text from file. Please ensure it\'s a valid text-based document.');
  }
}
