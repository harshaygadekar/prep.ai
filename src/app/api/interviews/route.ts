import { NextResponse, NextRequest } from "next/server"
import { auth } from "@clerk/nextjs/server"
import DatabaseService from "@/lib/db.service"
import { nanoid } from "nanoid"

export async function GET(req: NextRequest) {
  try {
    const { userId, orgId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const interviews = await DatabaseService.getAllInterviews(userId, orgId || undefined)

    return NextResponse.json(
      { interviews },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error fetching interviews:", error)

    return NextResponse.json(
      { error: "Failed to fetch interviews" },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId, orgId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await req.json()
    const {
      name,
      description,
      objective,
      questions,
      questionCount,
      timeDuration,
      isAnonymous,
      themeColor,
      logoUrl,
      interviewerId
    } = body

    if (!name || !questions) {
      return NextResponse.json(
        { error: "Missing required fields: name and questions" },
        { status: 400 }
      )
    }

    // Generate unique URL slug
    const urlSlug = `${nanoid(10)}-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 30)}`

    const interview = await DatabaseService.createInterview({
      userId,
      orgId: orgId || undefined,
      name,
      description,
      objective,
      questions,
      questionCount: questionCount || (Array.isArray(questions) ? questions.length : 5),
      timeDuration: timeDuration || "30",
      isAnonymous: isAnonymous || false,
      themeColor,
      logoUrl,
      urlSlug,
      interviewerId
    })

    return NextResponse.json(
      { interview },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error creating interview:", error)

    return NextResponse.json(
      { error: "Failed to create interview" },
      { status: 500 }
    )
  }
}
