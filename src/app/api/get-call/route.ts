import { NextResponse } from "next/server";
import { MockDataService } from "@/lib/mockData";

export async function POST(req: Request, res: Response) {
  try {
    const body = await req.json();
    const callId = body.id;

    // Mock call response data
    const mockCallResponse = {
      call_id: callId,
      start_timestamp: Date.now() - 900000, // 15 minutes ago
      end_timestamp: Date.now(),
      duration: 900, // 15 minutes
      transcript: "Mock interview transcript with candidate responses...",
      status: "completed"
    };

    // Mock analytics data
    const mockAnalytics = {
      overall_score: Math.round((Math.random() * 3 + 7) * 10) / 10,
      communication_score: Math.round((Math.random() * 2 + 7.5) * 10) / 10,
      technical_score: Math.round((Math.random() * 2 + 7.0) * 10) / 10,
      confidence_score: Math.round((Math.random() * 2 + 7.2) * 10) / 10,
      feedback: "Good interview performance with clear communication and relevant examples.",
      strengths: ["Clear communication", "Good examples", "Professional demeanor"],
      improvements: ["Add more technical details", "Provide specific metrics"]
    };

    return NextResponse.json(
      {
        callResponse: mockCallResponse,
        analytics: mockAnalytics,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing call:", error);
    
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
