import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import DatabaseService from "@/lib/db.service";
import RetellService from "@/lib/retell.service";

export async function POST(req: NextRequest) {
  try {
    // Authentication check
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in to access call data." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { callId } = body;

    if (!callId) {
      return NextResponse.json(
        { error: "Call ID is required" },
        { status: 400 }
      );
    }

    // Get session from database using callId
    const session = await DatabaseService.getSessionByCallId(callId);

    if (!session) {
      return NextResponse.json(
        { error: "Session not found for this call ID" },
        { status: 404 }
      );
    }

    // Verify the session belongs to the user's interview
    if (session.interview.userId !== userId) {
      return NextResponse.json(
        { error: "Unauthorized access to this call" },
        { status: 403 }
      );
    }

    // Try to get call details from Retell if configured
    let retellCallData = null;
    if (RetellService.isConfigured()) {
      try {
        retellCallData = await RetellService.getCall(callId);
      } catch (error) {
        console.error("Error fetching Retell call data:", error);
        // Continue without Retell data if it fails
      }
    }

    // Prepare call response
    const callResponse = {
      call_id: callId,
      session_id: session.id,
      start_timestamp: session.createdAt.getTime(),
      end_timestamp: session.endedAt?.getTime() || Date.now(),
      duration: session.duration || 0,
      transcript: retellCallData?.transcript || "Transcript not available",
      status: session.status,
      recording_url: retellCallData?.recording_url || null,
      // Include Retell-specific data if available
      retell_data: retellCallData ? {
        agent_id: retellCallData.agent_id,
        from_number: retellCallData.from_number,
        to_number: retellCallData.to_number,
        call_type: retellCallData.call_type,
        disconnection_reason: retellCallData.disconnection_reason
      } : null
    };

    // Prepare analytics data from session
    const analytics = {
      overall_score: session.overallScore || 0,
      communication_score: session.communicationScore || 0,
      technical_score: session.technicalScore || 0,
      problem_solving_score: session.problemSolvingScore || 0,
      confidence_score: session.confidenceScore || 0,
      feedback: session.feedback || "No feedback available yet.",
      tab_switch_count: session.tabSwitchCount || 0,
      // Include response-level analytics
      response_count: session.responses?.length || 0,
      responses: session.responses?.map(r => ({
        question: r.question,
        answer: r.answer.substring(0, 100) + (r.answer.length > 100 ? "..." : ""),
        score: r.score,
        strengths: r.strengths,
        improvements: r.improvements
      })) || []
    };

    return NextResponse.json(
      {
        success: true,
        callResponse,
        analytics,
        session: {
          id: session.id,
          interview_name: session.interview.name,
          interviewer_name: session.interview.interviewer?.name,
          candidate_name: session.candidateName,
          candidate_email: session.candidateEmail,
          created_at: session.createdAt,
          ended_at: session.endedAt,
          status: session.status
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing call:", error);

    const errorMessage = error instanceof Error
      ? error.message
      : "Failed to retrieve call data";

    return NextResponse.json(
      {
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? String(error) : undefined
      },
      { status: 500 }
    );
  }
}
