import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import DatabaseService from "@/lib/db.service";
import Retell from "retell-sdk";

// Initialize Retell client if API key is available
const retellClient = process.env.RETELL_API_KEY
  ? new Retell({
      apiKey: process.env.RETELL_API_KEY
    })
  : null;

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { interviewer_id, interviewId, metadata } = body;

    // Get interviewer details from database
    const interviewer = await DatabaseService.getInterviewerById(interviewer_id);

    if (!interviewer) {
      return NextResponse.json(
        { error: "Interviewer not found" },
        { status: 404 }
      );
    }

    // Verify the interview belongs to the user
    const interview = await DatabaseService.getInterviewById(interviewId);
    if (!interview || interview.userId !== userId) {
      return NextResponse.json(
        { error: "Interview not found or unauthorized" },
        { status: 404 }
      );
    }

    let registerCallResponse;

    // If Retell API key is configured, use real Retell AI
    if (retellClient && interviewer.agentId) {
      try {
        // Register call with Retell AI
        const response = await retellClient.call.register({
          agent_id: interviewer.agentId,
          audio_websocket_protocol: "web",
          audio_encoding: "s16le",
          sample_rate: 24000,
          metadata: {
            userId,
            interviewId,
            interviewerId: interviewer_id,
            ...metadata
          }
        });

        registerCallResponse = {
          call_id: response.call_id,
          access_token: response.access_token,
          agent_id: response.agent_id,
          web_call_url: response.web_call_url || `${process.env.NEXT_PUBLIC_LIVE_URL}/call/${interviewId}`,
          status: "registered"
        };

        // Create session in database
        await DatabaseService.createSession({
          interviewId,
          userId,
          callId: response.call_id,
          candidateName: metadata?.candidateName,
          candidateEmail: metadata?.candidateEmail
        });

      } catch (error) {
        console.error("Retell API error:", error);
        // Fallback to mock if Retell fails
        registerCallResponse = createMockResponse(interviewer);
      }
    } else {
      // Use mock response when Retell is not configured
      registerCallResponse = createMockResponse(interviewer);

      // Create mock session in database
      await DatabaseService.createSession({
        interviewId,
        userId,
        callId: registerCallResponse.call_id,
        candidateName: metadata?.candidateName,
        candidateEmail: metadata?.candidateEmail
      });
    }

    return NextResponse.json(
      {
        success: true,
        registerCallResponse
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error registering call:", error);

    return NextResponse.json(
      { error: "Failed to register call. Please try again." },
      { status: 500 }
    );
  }
}

function createMockResponse(interviewer: any) {
  const callId = `call_${Date.now()}`;
  return {
    call_id: callId,
    access_token: `token_${Date.now()}`,
    agent_id: interviewer.agentId || `agent_${interviewer.id}`,
    web_call_url: `${process.env.NEXT_PUBLIC_LIVE_URL}/call/${callId}`,
    status: "registered",
    note: "Using mock call - Configure RETELL_API_KEY for real voice interviews"
  };
}
