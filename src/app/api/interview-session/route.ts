import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import DatabaseService from "@/lib/db.service"
import GroqService from "@/lib/groq.service"

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { action, interviewId, sessionData, responseData } = body

    switch (action) {
      case "start_session":
        const newSession = await DatabaseService.createSession({
          interviewId,
          userId,
          candidateName: sessionData?.candidateName,
          candidateEmail: sessionData?.candidateEmail,
          callId: sessionData?.callId
        })

        return NextResponse.json({
          success: true,
          session: newSession,
          message: "Session started successfully"
        })

      case "submit_response":
        // Use Groq to analyze the response
        const analysis = await GroqService.analyzeResponse({
          question: responseData.question,
          answer: responseData.answer
        })

        const response = await DatabaseService.createResponse({
          sessionId: responseData.sessionId,
          question: responseData.question,
          answer: responseData.answer,
          score: analysis.score,
          feedback: analysis.feedback,
          strengths: analysis.strengths,
          improvements: analysis.improvements,
          analysisData: {
            communicationScore: analysis.communicationScore,
            technicalScore: analysis.technicalScore,
            problemSolvingScore: analysis.problemSolvingScore,
            confidenceScore: analysis.confidenceScore
          }
        })

        // Update session with latest scores
        await DatabaseService.updateSession(responseData.sessionId, {
          communicationScore: analysis.communicationScore,
          technicalScore: analysis.technicalScore,
          problemSolvingScore: analysis.problemSolvingScore,
          confidenceScore: analysis.confidenceScore
        })

        return NextResponse.json({
          success: true,
          response: {
            ...response,
            breakdown: {
              communication: analysis.communicationScore,
              technical: analysis.technicalScore,
              problemSolving: analysis.problemSolvingScore,
              confidence: analysis.confidenceScore
            }
          },
          message: "Response submitted and analyzed"
        })

      case "end_session":
        const session = await DatabaseService.getSessionById(sessionData.sessionId)
        if (session) {
          // Calculate overall score from all responses
          const sessionResponses = await DatabaseService.getResponsesBySessionId(sessionData.sessionId)
          const overallScore = sessionResponses.length > 0
            ? sessionResponses.reduce((acc, r) => acc + r.score, 0) / sessionResponses.length
            : 0

          const avgComm = sessionResponses.reduce((acc, r) => acc + ((r.analysisData as any)?.communicationScore || 0), 0) / sessionResponses.length || 0
          const avgTech = sessionResponses.reduce((acc, r) => acc + ((r.analysisData as any)?.technicalScore || 0), 0) / sessionResponses.length || 0
          const avgProblem = sessionResponses.reduce((acc, r) => acc + ((r.analysisData as any)?.problemSolvingScore || 0), 0) / sessionResponses.length || 0
          const avgConf = sessionResponses.reduce((acc, r) => acc + ((r.analysisData as any)?.confidenceScore || 0), 0) / sessionResponses.length || 0

          const updatedSession = await DatabaseService.updateSession(sessionData.sessionId, {
            status: "COMPLETED",
            endTime: new Date(),
            duration: sessionData.duration,
            overallScore: Math.round(overallScore * 10) / 10,
            communicationScore: Math.round(avgComm * 10) / 10,
            technicalScore: Math.round(avgTech * 10) / 10,
            problemSolvingScore: Math.round(avgProblem * 10) / 10,
            confidenceScore: Math.round(avgConf * 10) / 10
          })

          // Increment response count for the interview
          await DatabaseService.incrementResponseCount(session.interviewId)

          return NextResponse.json({
            success: true,
            session: updatedSession,
            overallScore: Math.round(overallScore * 10) / 10,
            message: "Session ended successfully"
          })
        }

        return NextResponse.json({ error: "Session not found" }, { status: 404 })

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("Interview session API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get("sessionId")
    const interviewId = searchParams.get("interviewId")

    if (sessionId) {
      const session = await DatabaseService.getSessionById(sessionId)

      // Check if session belongs to the user
      if (session && session.userId === userId) {
        return NextResponse.json({
          session,
          responses: session.responses
        })
      } else {
        return NextResponse.json({ error: "Session not found" }, { status: 404 })
      }
    }

    if (interviewId) {
      const sessions = await DatabaseService.getSessionsByInterviewId(interviewId)
      return NextResponse.json({ sessions })
    }

    // Return all user sessions
    const userSessions = await DatabaseService.getSessionsByUserId(userId)
    return NextResponse.json({ sessions: userSessions })
  } catch (error) {
    console.error("Get interview session API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
