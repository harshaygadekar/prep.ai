import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import GroqService from "@/lib/groq.service";
import DatabaseService from "@/lib/db.service";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { question, answer, context, sessionId } = body;

    if (!question || !answer) {
      return NextResponse.json(
        { error: "Question and answer are required" },
        { status: 400 }
      );
    }

    // Use Groq AI to analyze the response
    const result = await GroqService.analyzeResponse({
      question,
      answer,
      context
    });

    // If sessionId provided, store the response in database
    if (sessionId) {
      try {
        await DatabaseService.createResponse({
          sessionId,
          question,
          answer,
          score: result.score,
          feedback: result.feedback,
          strengths: result.strengths,
          improvements: result.improvements,
          analysisData: {
            communicationScore: result.communicationScore,
            technicalScore: result.technicalScore,
            problemSolvingScore: result.problemSolvingScore,
            confidenceScore: result.confidenceScore
          }
        });
      } catch (error) {
        console.error("Failed to store response:", error);
        // Continue even if storage fails
      }
    }

    return NextResponse.json({
      success: true,
      scoring: {
        overallScore: result.score,
        breakdown: {
          communication: result.communicationScore,
          technical: result.technicalScore,
          problemSolving: result.problemSolvingScore,
          confidence: result.confidenceScore,
          relevance: (result.score + result.technicalScore) / 2 // Calculate relevance
        },
        feedback: result.feedback,
        strengths: result.strengths,
        improvements: result.improvements
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("Scoring API error:", error);
    return NextResponse.json(
      { error: "Failed to analyze response. Please try again." },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("sessionId");
    const interviewId = searchParams.get("interviewId");

    if (sessionId) {
      // Get specific session scores
      const session = await DatabaseService.getSessionById(sessionId);

      if (!session || session.userId !== userId) {
        return NextResponse.json({ error: "Session not found" }, { status: 404 });
      }

      const responses = await DatabaseService.getResponsesBySessionId(sessionId);

      return NextResponse.json({
        success: true,
        session,
        responses,
        overallScore: session.overallScore || 0
      });
    }

    // Get user's historical scoring data
    const sessions = await DatabaseService.getSessionsByUserId(userId);
    const completedSessions = sessions.filter(s => s.status === 'COMPLETED');

    const scores = completedSessions.map(session => ({
      id: session.id,
      sessionId: session.id,
      interviewId: session.interviewId,
      timestamp: session.startTime,
      overallScore: session.overallScore || 0,
      breakdown: {
        communication: session.communicationScore || 0,
        technical: session.technicalScore || 0,
        problemSolving: session.problemSolvingScore || 0,
        confidence: session.confidenceScore || 0,
        relevance: session.overallScore || 0
      }
    }));

    const averageScore = scores.length > 0
      ? scores.reduce((acc, score) => acc + score.overallScore, 0) / scores.length
      : 0;

    return NextResponse.json({
      success: true,
      scores,
      summary: {
        averageScore: Math.round(averageScore * 10) / 10,
        totalSessions: scores.length,
        improvementTrend: scores.length > 1 &&
          scores[scores.length - 1].overallScore > scores[0].overallScore
          ? "improving" : "stable"
      }
    });

  } catch (error) {
    console.error("Get scoring API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
