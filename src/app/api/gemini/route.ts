import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  try {
    const { texts } = await req.json();

    if (!texts || !Array.isArray(texts) || texts.length === 0) {
      return NextResponse.json({ error: "Missing or invalid texts array" }, { status: 400 });
    }
    
    // Combine all texts with clear separation between documents
    const combinedText = texts.join("\n\n--- NEW DOCUMENT ---\n\n");

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Prompt yêu cầu định dạng JSON chính xác
      const prompt = `
        You are an AI that generates multiple-choice questions (MCQs) from provided text.
        Return ONLY a valid raw JSON, without triple backticks, without language tags, without extra text.
        Generate exactly 5 MCQs in the following JSON format (no additional text, no explanation outside JSON):

        {
          "questions": [
            {
              "id": "string",
              "questionText": "string",
              "options": {
                "A": "string",
                "B": "string",
                "C": "string",
                "D": "string"
              },
              "correctAnswer": "string",
              "explanation": "string"
            }
          ]
        }

        Rules:
        - "id" is a unique identifier (can be uuid or incremental string).
        - "questionText" must be between 10 and 1000 characters.
        - "correctAnswer" must match exactly one of the option keys ("A", "B", "C", "D").
        - "explanation" cannot exceed 500 characters.
        - Do NOT include any commentary, explanations, or markdown formatting outside the JSON.
        - No trailing commas in JSON.
        - Ensure the JSON is syntactically valid.
        - Base your questions on the entire content, which may contain multiple documents.
        
        Context:
        ${combinedText}
      `;

    const result = await model.generateContent(prompt);
    let output = result.response.text().trim();

    // Loại bỏ backticks nếu có
    output = output.replace(/```(?:json)?/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(output);
    } catch (err) {
      console.error("Failed to parse Gemini output:", err, output);
      return NextResponse.json(
        { error: "Invalid JSON from Gemini" },
        { status: 500 }
      );
    }

    return NextResponse.json({ mcqs: parsed.questions || [] });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}


