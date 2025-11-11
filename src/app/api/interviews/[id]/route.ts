import { NextResponse, NextRequest } from "next/server";
import { MockDataService } from "@/lib/mockData";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const interview = MockDataService.getInterviewById(params.id);
    
    if (!interview) {
      return NextResponse.json(
        { error: "Interview not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { interview },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching interview:", error);
    
    return NextResponse.json(
      { error: "Failed to fetch interview" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const interview = MockDataService.updateInterview(params.id, body);
    
    if (!interview) {
      return NextResponse.json(
        { error: "Interview not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { interview },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating interview:", error);
    
    return NextResponse.json(
      { error: "Failed to update interview" },
      { status: 500 }
    );
  }
}