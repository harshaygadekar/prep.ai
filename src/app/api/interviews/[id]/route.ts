import { NextResponse, NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { DatabaseService } from "@/lib/db.service";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Authenticate the request
    const { userId, orgId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Await params for Next.js 15 compatibility
    const { id } = await params;

    const interview = await DatabaseService.getInterviewById(id);

    if (!interview) {
      return NextResponse.json(
        { error: "Interview not found" },
        { status: 404 }
      );
    }

    // Verify user owns the interview or has access via organization
    if (interview.userId !== userId && (!orgId || interview.orgId !== orgId)) {
      return NextResponse.json(
        { error: "Forbidden: You don't have access to this interview" },
        { status: 403 }
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Authenticate the request
    const { userId, orgId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Await params for Next.js 15 compatibility
    const { id } = await params;

    // Check if interview exists and user has access
    const existingInterview = await DatabaseService.getInterviewById(id);

    if (!existingInterview) {
      return NextResponse.json(
        { error: "Interview not found" },
        { status: 404 }
      );
    }

    // Verify user owns the interview or has access via organization
    if (existingInterview.userId !== userId && (!orgId || existingInterview.orgId !== orgId)) {
      return NextResponse.json(
        { error: "Forbidden: You don't have access to this interview" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const interview = await DatabaseService.updateInterview(id, body);

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