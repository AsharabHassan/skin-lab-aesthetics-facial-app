import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { FILLER_ANALYSIS_PROMPT } from "@/lib/prompts";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { imageDataUrl } = await req.json();

    if (!imageDataUrl || !imageDataUrl.startsWith("data:image/")) {
      return NextResponse.json({ error: "Invalid image data" }, { status: 400 });
    }

    // Extract base64 from data URL
    const base64 = imageDataUrl.split(",")[1];
    const mediaType = imageDataUrl.split(";")[0].split(":")[1] as
      | "image/jpeg"
      | "image/png"
      | "image/webp";

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: { type: "base64", media_type: mediaType, data: base64 },
            },
            {
              type: "text",
              text: FILLER_ANALYSIS_PROMPT,
            },
          ],
        },
      ],
    });

    const responseText =
      message.content[0].type === "text" ? message.content[0].text : "";

    // Parse JSON from response
    const result = JSON.parse(responseText);

    return NextResponse.json({ result });
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      { error: "Analysis failed. Please try again." },
      { status: 500 }
    );
  }
}
