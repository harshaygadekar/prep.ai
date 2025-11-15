import Groq from "groq-sdk";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { logger } from "@/lib/logger";
import {
  SYSTEM_PROMPT,
  getCommunicationAnalysisPrompt,
} from "@/lib/prompts/communication-analysis";

export async function POST(req: Request) {
  logger.info("analyze-communication request received");

  try {
    // Authenticate the request
    const { userId } = await auth();

    if (!userId) {
      logger.warn("Unauthorized access attempt to analyze-communication");
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }

    const body = await req.json();
    const { transcript } = body;

    if (!transcript) {
      return NextResponse.json(
        { error: "Transcript is required" },
        { status: 400 },
      );
    }

    // Validate API key exists
    if (!process.env.GROQ_API_KEY) {
      logger.error("GROQ_API_KEY is not configured");
      return NextResponse.json(
        { error: "Groq API key not configured" },
        { status: 500 },
      );
    }

    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    const completion = await groq.chat.completions.create({
      model: "mixtral-8x7b-32768",
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: getCommunicationAnalysisPrompt(transcript),
        },
      ],
      temperature: 0.7,
      max_tokens: 4096,
      response_format: { type: "json_object" },
    });

    const analysis = completion.choices[0]?.message?.content;

    logger.info("Communication analysis completed successfully");

    try {
      const parsedAnalysis = JSON.parse(analysis || "{}");
      return NextResponse.json(
        { analysis: parsedAnalysis },
        { status: 200 },
      );
    } catch (parseError) {
      logger.error("Failed to parse Groq response", parseError);
      return NextResponse.json(
        { error: "Invalid response format from AI service" },
        { status: 500 },
      );
    }
  } catch (error) {
    logger.error("Error analyzing communication skills", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
