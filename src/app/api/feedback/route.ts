import { NextRequest, NextResponse } from "next/server";
import DatabaseService from "@/lib/db.service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { interview_id, satisfaction, feedback, email } = body;

    if (!interview_id) {
      return NextResponse.json(
        { error: "Interview ID is required" },
        { status: 400 }
      );
    }

    // Store feedback in the interview's metadata or a JSON field
    // Since we don't have a Feedback table, we'll store it with the session
    // Find the most recent session for this interview and email
    const sessions = await DatabaseService.getSessionsByInterviewId(interview_id);
    const userSession = sessions.find(s => s.candidateEmail === email);

    if (userSession) {
      // Update session with feedback
      await DatabaseService.updateSession(userSession.id, {
        feedback: {
          satisfaction,
          feedback,
          email,
          submittedAt: new Date().toISOString()
        }
      });
    }

    return NextResponse.json(
      {
        success: true,
        message: "Feedback submitted successfully"
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error submitting feedback:", error);
    return NextResponse.json(
      { error: "Failed to submit feedback" },
      { status: 500 }
    );
  }
}
