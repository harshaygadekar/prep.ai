import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import DatabaseService from "@/lib/db.service";
import GroqService from "@/lib/groq.service";

export async function POST(req: NextRequest) {
  try {
    // Authentication check
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in to generate insights." },
        { status: 401 }
      );
    }

    // Environment variable validation
    if (!process.env.GROQ_API_KEY) {
      console.error("GROQ_API_KEY is not configured");
      return NextResponse.json(
        {
          error: "AI service not configured. Please contact support.",
          details: process.env.NODE_ENV === 'development'
            ? "GROQ_API_KEY environment variable is missing"
            : undefined
        },
        { status: 503 }
      );
    }

    const body = await req.json();
    const { sessionId } = body;

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 }
      );
    }

    // Get session with responses from database
    const session = await DatabaseService.getSessionById(sessionId);

    if (!session) {
      return NextResponse.json(
        { error: "Session not found" },
        { status: 404 }
      );
    }

    // Verify the session belongs to the user's interview
    if (session.interview.userId !== userId) {
      return NextResponse.json(
        { error: "Unauthorized access to this session" },
        { status: 403 }
      );
    }

    // Check if session has responses
    if (!session.responses || session.responses.length === 0) {
      return NextResponse.json(
        {
          error: "No responses found for this session. Complete the interview first."
        },
        { status: 400 }
      );
    }

    // Prepare response data for insights generation
    const responsesData = session.responses.map(r => ({
      question: r.question,
      answer: r.answer,
      score: r.score
    }));

    // Calculate overall score from responses
    const overallScore = session.overallScore ||
      (session.responses.reduce((acc, r) => acc + r.score, 0) / session.responses.length);

    // Generate insights using GroqService
    const insights = await GroqService.generateInsights({
      responses: responsesData,
      overallScore
    });

    // Update session with insights
    await DatabaseService.updateSession(sessionId, {
      insights: {
        summary: insights.summary,
        keyStrengths: insights.keyStrengths,
        areasToImprove: insights.areasToImprove,
        recommendations: insights.recommendations
      }
    });

    return NextResponse.json(
      {
        success: true,
        insights: {
          summary: insights.summary,
          key_strengths: insights.keyStrengths,
          areas_for_improvement: insights.areasToImprove,
          recommendations: insights.recommendations,
          overall_score: overallScore,
          score_breakdown: {
            communication: session.communicationScore || 0,
            technical: session.technicalScore || 0,
            problem_solving: session.problemSolvingScore || 0,
            confidence: session.confidenceScore || 0
          }
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error generating insights:", error);

    const errorMessage = error instanceof Error
      ? error.message
      : "Failed to generate insights";

    return NextResponse.json(
      {
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? String(error) : undefined
      },
      { status: 500 }
    );
  }
}
