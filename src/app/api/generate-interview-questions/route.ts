import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import GroqService from "@/lib/groq.service"

export async function POST(request: NextRequest) {
  try {
    // Authentication check
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in to generate questions." },
        { status: 401 }
      )
    }

    // Environment variable validation
    if (!process.env.GROQ_API_KEY) {
      console.error("GROQ_API_KEY is not configured")
      return NextResponse.json(
        {
          error: "AI service not configured. Please contact support.",
          details: process.env.NODE_ENV === 'development'
            ? "GROQ_API_KEY environment variable is missing"
            : undefined
        },
        { status: 503 }
      )
    }

    const body = await request.json()
    const { name, objective, number, context, skills } = body

    // Validate required fields
    if (!name || !objective || !number) {
      return NextResponse.json(
        { error: "Missing required fields: name, objective, number" },
        { status: 400 }
      )
    }

    // Validate question count
    const questionCount = parseInt(number)
    if (isNaN(questionCount) || questionCount < 1 || questionCount > 50) {
      return NextResponse.json(
        { error: "Question count must be between 1 and 50" },
        { status: 400 }
      )
    }

    // Use Groq AI to generate questions
    const questions = await GroqService.generateInterviewQuestions({
      role: name,
      objective,
      questionCount,
      context: context || undefined,
      skills: Array.isArray(skills) ? skills : []
    })

    // Validate that we got questions back
    if (!questions || questions.length === 0) {
      return NextResponse.json(
        { error: "Failed to generate questions. Please try again." },
        { status: 500 }
      )
    }

    const response = {
      questions: questions.map(q => ({ question: q })),
      description: `AI-generated interview questions for ${name} focusing on ${objective}`
    }

    return NextResponse.json({
      success: true,
      response: JSON.stringify(response)
    })
  } catch (error) {
    console.error("Question generation error:", error)

    const errorMessage = error instanceof Error
      ? error.message
      : "Failed to generate questions"

    return NextResponse.json(
      {
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? String(error) : undefined
      },
      { status: 500 }
    )
  }
}
