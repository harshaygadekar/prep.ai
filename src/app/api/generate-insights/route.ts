import { NextResponse } from "next/server";
import { MockDataService } from "@/lib/mockData";

export async function POST(req: Request, res: Response) {
  try {
    const body = await req.json();
    const interviewId = body.interviewId;

    const interview = MockDataService.getInterviewById(interviewId);
    
    if (!interview) {
      return NextResponse.json(
        { error: "Interview not found" },
        { status: 404 }
      );
    }

    // Mock insights generation
    const mockInsights = {
      insights: {
        overall_performance: "Strong performance with good communication skills and relevant experience.",
        key_strengths: [
          "Clear and articulate communication",
          "Relevant technical experience",
          "Good problem-solving approach",
          "Professional demeanor"
        ],
        areas_for_improvement: [
          "Could provide more specific examples",
          "Add quantifiable results when possible",
          "Elaborate on technical challenges faced"
        ],
        recommendations: [
          "Practice the STAR method for behavioral questions",
          "Prepare specific metrics and achievements",
          "Research company-specific technical challenges"
        ],
        score_breakdown: {
          communication: 8.5,
          technical_knowledge: 7.8,
          problem_solving: 8.2,
          cultural_fit: 8.0
        },
        overall_score: 8.1
      }
    };

    // Update the interview with insights
    MockDataService.updateInterview(interviewId, {
      insights: mockInsights.insights
    });

    return NextResponse.json(
      {
        response: JSON.stringify(mockInsights),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error generating insights:", error);

    return NextResponse.json(
      { error: "internal server error" },
      { status: 500 }
    );
  }
}
