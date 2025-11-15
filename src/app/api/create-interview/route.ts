import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import DatabaseService from "@/lib/db.service";

export async function POST(req: NextRequest) {
  try {
    // Authenticate user
    const { userId, orgId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await req.json();
    const payload = body.interviewData;

    // Validate required fields
    if (!payload || !payload.name) {
      return NextResponse.json(
        { error: "Missing required field: name" },
        { status: 400 }
      );
    }

    // Generate URL slug
    const randomString = nanoid(10);
    const sanitizedName = payload.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 40);

    let urlSlug = `${randomString}-${sanitizedName}`;

    // Use organization-based slug if provided
    if (body.organizationName) {
      const interviewNameSlug = payload.name.toLowerCase().replace(/\s+/g, "-");
      const orgNameSlug = body.organizationName.toLowerCase().replace(/\s+/g, "-");
      urlSlug = `${randomString}-${orgNameSlug}-${interviewNameSlug}`;
    }

    // Create interview in database
    const newInterview = await DatabaseService.createInterview({
      userId,
      orgId: orgId || undefined,
      name: payload.name,
      description: payload.description || null,
      objective: payload.objective || null,
      questions: payload.questions || [],
      questionCount: payload.questionCount || payload.questions?.length || 5,
      timeDuration: payload.timeDuration || payload.time_duration || "30",
      isAnonymous: payload.isAnonymous ?? payload.is_anonymous ?? false,
      themeColor: payload.themeColor || payload.theme_color || null,
      logoUrl: payload.logoUrl || payload.logo_url || null,
      urlSlug,
      interviewerId: payload.interviewerId || payload.interviewer_id || null
    });

    // Generate shareable URL
    const baseUrl = process.env.NEXT_PUBLIC_LIVE_URL || "http://localhost:3000";
    const shareUrl = `${baseUrl}/call/${urlSlug}`;

    return NextResponse.json(
      {
        response: "Interview created successfully",
        interview: newInterview,
        url: shareUrl,
        urlSlug
      },
      { status: 201 }
    );

  } catch (err: any) {
    console.error("Error creating interview:", err);

    // Handle specific errors
    if (err.code === 'P2002') {
      return NextResponse.json(
        { error: "An interview with this URL already exists. Please try again." },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: err.message || "Failed to create interview" },
      { status: 500 }
    );
  }
}
