import { NextResponse, NextRequest } from "next/server"
import { auth } from "@clerk/nextjs/server"
import DatabaseService from "@/lib/db.service"

export async function POST(req: NextRequest) {
  try {
    const { userId, orgId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Check if default interviewers already exist
    const existing = await DatabaseService.getAllInterviewers(userId, orgId || undefined)
    const hasLisa = existing.some(i => i.name === "Lisa" && i.userId === userId)
    const hasBob = existing.some(i => i.name === "Bob" && i.userId === userId)

    const created = []

    // Create Lisa - Friendly interviewer
    if (!hasLisa) {
      const lisa = await DatabaseService.createInterviewer({
        userId,
        orgId: orgId || undefined,
        name: "Lisa",
        description: "Friendly and encouraging interviewer perfect for beginners",
        personality: "Supportive and patient, helps candidates feel comfortable",
        expertise: ["Behavioral Questions", "Communication Skills", "General Interview Prep"],
        avatarUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
        agentId: `agent_lisa_${Date.now()}`,
        rapport: 8,
        exploration: 6,
        empathy: 9,
        speed: 0.9
      })
      created.push(lisa)
    }

    // Create Bob - Technical interviewer
    if (!hasBob) {
      const bob = await DatabaseService.createInterviewer({
        userId,
        orgId: orgId || undefined,
        name: "Bob",
        description: "Professional technical interviewer for advanced candidates",
        personality: "Direct and thorough, focuses on technical competency",
        expertise: ["Technical Questions", "System Design", "Problem Solving", "Coding"],
        avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        agentId: `agent_bob_${Date.now()}`,
        rapport: 6,
        exploration: 8,
        empathy: 5,
        speed: 1.1
      })
      created.push(bob)
    }

    return NextResponse.json(
      {
        interviewers: created,
        message: created.length > 0
          ? `${created.length} default interviewer(s) created successfully!`
          : "Default interviewers already exist"
      },
      { status: created.length > 0 ? 201 : 200 }
    )
  } catch (error) {
    console.error("Error creating interviewers:", error)

    return NextResponse.json(
      { error: "Failed to create interviewers" },
      { status: 500 }
    )
  }
}
