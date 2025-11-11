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

    // Use Groq AI to parse resume and extract structured information
    const resumeData = await GroqService.parseResume(resumeText);

    // Generate interview questions based on resume using Groq
    const questions = await GroqService.generateInterviewQuestions({
      role: resumeData.currentRole || 'Software Engineer',
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
    return NextResponse.json({
      error: 'Failed to process resume. Please try again.'
    }, { status: 500 });
  }
}

async function extractTextFromFile(file: File): Promise<string> {
  // For plain text files, read directly
  if (file.type === 'text/plain') {
    return await file.text();
  }

  // For PDF and DOC files in production:
  // - Use 'pdf-parse' for PDFs
  // - Use 'mammoth' for DOC/DOCX
  // - Consider using services like AWS Textract or Google Document AI

  // For demo purposes, return the file as text (for PDFs this won't work well)
  // In production, implement proper parsing
  try {
    return await file.text();
  } catch (error) {
    console.error('File extraction error:', error);
    throw new Error('Unable to extract text from file. Please ensure it\'s a valid text-based document.');
  }
}
