import { NextRequest, NextResponse } from "next/server";
import { Retell } from "retell-sdk";
import DatabaseService from "@/lib/db.service";

export async function POST(req: NextRequest) {
  try {
    // Validate API key exists
    const apiKey = process.env.RETELL_API_KEY;
    if (!apiKey) {
      console.error("RETELL_API_KEY is not configured");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    // Parse request body
    const body = await req.json();

    // Verify Retell signature
    const signature = req.headers.get("x-retell-signature");
    if (!signature) {
      console.error("Missing signature header");
      return NextResponse.json(
        { error: "Missing signature" },
        { status: 401 }
      );
    }

    const isValid = Retell.verify(
      JSON.stringify(body),
      apiKey,
      signature
    );

    if (!isValid) {
      console.error("Invalid signature");
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 401 }
      );
    }

    const { event, call } = body as {
      event: string;
      call: {
        call_id: string;
        agent_id?: string;
        start_timestamp?: number;
        end_timestamp?: number;
        transcript?: string;
        recording_url?: string;
        public_log_url?: string;
        [key: string]: any;
      };
    };

    console.log(`Webhook event received: ${event} for call ${call.call_id}`);

    // Handle different event types
    switch (event) {
      case "call_started":
        await handleCallStarted(call);
        break;

      case "call_ended":
        await handleCallEnded(call);
        break;

      case "call_analyzed":
        await handleCallAnalyzed(call);
        break;

      default:
        console.log("Received an unknown event:", event);
    }

    // Return proper 204 No Content response
    return new NextResponse(null, { status: 204 });

  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function handleCallStarted(call: any) {
  try {
    console.log("Call started:", call.call_id);

    // Update session status
    const session = await DatabaseService.getSessionByCallId(call.call_id);
    if (session) {
      await DatabaseService.updateSession(session.id, {
        status: "ACTIVE",
        startTime: new Date(call.start_timestamp || Date.now())
      });
    }
  } catch (error) {
    console.error("Error handling call_started:", error);
  }
}

async function handleCallEnded(call: any) {
  try {
    console.log("Call ended:", call.call_id);

    // Update session with end time and transcript
    const session = await DatabaseService.getSessionByCallId(call.call_id);
    if (session) {
      const startTime = session.startTime ? session.startTime.getTime() : Date.now();
      const endTime = call.end_timestamp || Date.now();
      const duration = Math.floor((endTime - startTime) / 1000); // Duration in seconds

      await DatabaseService.updateSession(session.id, {
        status: "COMPLETED",
        endTime: new Date(endTime),
        duration,
        transcript: call.transcript || session.transcript,
        metadata: {
          ...(session.metadata as any),
          recording_url: call.recording_url,
          public_log_url: call.public_log_url
        }
      });
    }
  } catch (error) {
    console.error("Error handling call_ended:", error);
  }
}

async function handleCallAnalyzed(call: any) {
  try {
    console.log("Call analyzed:", call.call_id);

    // Retrieve the Retell client and get call details
    const retellClient = new Retell({ apiKey: process.env.RETELL_API_KEY! });
    const callDetails = await retellClient.call.retrieve(call.call_id);

    // Update session with analysis data
    const session = await DatabaseService.getSessionByCallId(call.call_id);
    if (session) {
      await DatabaseService.updateSession(session.id, {
        transcript: callDetails.transcript,
        metadata: {
          ...(session.metadata as any),
          analysis: callDetails,
          recording_url: callDetails.recording_url,
          public_log_url: callDetails.public_log_url
        }
      });

      console.log("Session updated with call analysis");
    }
  } catch (error) {
    console.error("Error handling call_analyzed:", error);
  }
}
