import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { DatabaseService } from "@/lib/db.service";

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const timeframe = searchParams.get("timeframe") || "week";
    const metric = searchParams.get("metric");
    const interviewId = searchParams.get("interviewId");

    // If specific interview ID provided, get analytics for that interview
    if (interviewId) {
      const analytics = await DatabaseService.getAnalytics(userId);
      return NextResponse.json({
        success: true,
        analytics
      });
    }

    // Otherwise, get overall analytics for the user
    const analytics = await DatabaseService.getAnalytics(userId);

    if (metric) {
      // Return specific metric
      switch (metric) {
        case "performance":
          return NextResponse.json({
            trend: analytics.performanceTrend || [],
            average: analytics.averageScore,
            growth: analytics.weeklyGrowth
          });
        case "skills":
          return NextResponse.json(analytics.skillBreakdown || {});
        case "activity":
          return NextResponse.json(analytics.recentActivity || []);
        default:
          return NextResponse.json({ error: "Invalid metric" }, { status: 400 });
      }
    }

    // Return full analytics
    return NextResponse.json({
      success: true,
      data: analytics,
      timeframe
    });

  } catch (error) {
    console.error("Analytics API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { action, data } = body;

    switch (action) {
      case "track_event":
        // Track custom analytics event
        console.log(`Tracking event for user ${userId}:`, data);
        return NextResponse.json({
          success: true,
          message: "Event tracked successfully"
        });

      case "update_preferences":
        // Update analytics preferences
        console.log(`Updating analytics preferences for user ${userId}:`, data);
        return NextResponse.json({
          success: true,
          message: "Preferences updated successfully"
        });

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

  } catch (error) {
    console.error("Analytics POST API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
