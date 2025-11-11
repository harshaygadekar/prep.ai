import { NextRequest, NextResponse } from "next/server"
import GroqService from "@/lib/groq.service"

export async function POST(request: NextRequest) {
  try {
    const { name, objective, number, context, skills } = await request.json()

    // Validate required fields
    if (!name || !objective || !number) {
      return NextResponse.json(
        { error: "Missing required fields: name, objective, number" },
        { status: 400 }
      )
    }

    const questionCount = parseInt(number)

    // Use Groq AI to generate questions
    const questions = await GroqService.generateInterviewQuestions({
      role: name,
      objective,
      questionCount,
      context,
      skills: skills || []
    })

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
    return NextResponse.json(
      { error: "Failed to generate questions" },
      { status: 500 }
    )
  }
}
