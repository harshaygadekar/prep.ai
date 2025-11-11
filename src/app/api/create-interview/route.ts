import { nanoid } from "nanoid";
import { NextResponse } from "next/server";
import { MockDataService } from "@/lib/mockData";

const base_url = process.env.NEXT_PUBLIC_LIVE_URL;

export async function POST(req: Request, res: Response) {
  try {
    const url_id = nanoid();
    const url = `${base_url}/call/${url_id}`;
    const body = await req.json();

    const payload = body.interviewData;

    let readableSlug = null;
    if (body.organizationName) {
      const interviewNameSlug = payload.name?.toLowerCase().replace(/\s/g, "-");
      const orgNameSlug = body.organizationName
        ?.toLowerCase()
        .replace(/\s/g, "-");
      readableSlug = `${orgNameSlug}-${interviewNameSlug}`;
    }

    const newInterview = MockDataService.createInterview({
      ...payload,
      id: url_id,
      questions: payload.questions || ["Tell me about yourself."],
      is_active: true,
      response_count: 0
    });

    return NextResponse.json(
      { 
        response: "Interview created successfully",
        interview: newInterview,
        url: url
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error creating interview:", err);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
