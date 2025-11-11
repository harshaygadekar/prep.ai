import { NextResponse, NextRequest } from "next/server"
import { auth } from "@clerk/nextjs/server"
import DatabaseService from "@/lib/db.service"

export async function GET(req: NextRequest) {
  try {
    const { userId, orgId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const interviewers = await DatabaseService.getAllInterviewers(userId, orgId || undefined)

    return NextResponse.json(
      { interviewers },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error fetching interviewers:", error)

    return NextResponse.json(
      { error: "Failed to fetch interviewers" },
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
    const { name, description, personality, expertise, avatarUrl, agentId, rapport, exploration, empathy, speed } = body

    if (!name || !description || !personality) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const interviewer = await DatabaseService.createInterviewer({
      userId,
      orgId: orgId || undefined,
      name,
      description,
      personality,
      expertise: expertise || [],
      avatarUrl,
      agentId,
      rapport,
      exploration,
      empathy,
      speed
    })

    return NextResponse.json(
      { interviewer },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error creating interviewer:", error)

    return NextResponse.json(
      { error: "Failed to create interviewer" },
      { status: 500 }
    )
  }
}
