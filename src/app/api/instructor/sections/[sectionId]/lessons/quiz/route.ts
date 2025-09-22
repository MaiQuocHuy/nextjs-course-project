import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ sectionId: string }> }
) {
  try {
    const { sectionId } = await params;
    const url = new URL(req.url);
    const lessonId = url.searchParams.get('lessonId');
    
    if (!lessonId) {
      return NextResponse.json({ error: "Missing lessonId parameter" }, { status: 400 });
    }

    const questions = await req.json();
    
    console.log("Received quiz questions:", {
      sectionId,
      lessonId,
      questionsCount: questions.length
    });

    // TODO: Forward to Spring Boot backend
    // const backendUrl = `${process.env.NEXT_PUBLIC_API_BACKEND_URL}/instructor/sections/${sectionId}/lessons/quiz?lessonId=${lessonId}`;
    // const response = await fetch(backendUrl, {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(questions)
    // });

    // For now, just simulate success
    return NextResponse.json({ 
      message: "Quiz questions saved successfully",
      sectionId,
      lessonId,
      questionsCount: questions.length
    });

  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
