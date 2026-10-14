import { NextResponse } from "next/server";
import { getQuizPublicData, getQuizById, deleteQuiz } from "@/lib/quiz/storage";

export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const publicData = await getQuizPublicData(id);

    if (!publicData) {
      return NextResponse.json(
        { success: false, error: "Quiz not found or may have been deleted." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      quiz: publicData,
    });
  } catch (err) {
    console.error("[API Quiz GET Error]:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const { pin } = body;

    const quiz = await getQuizById(id);
    if (!quiz) {
      return NextResponse.json(
        { success: false, error: "Quiz not found." },
        { status: 404 }
      );
    }

    // Verify PIN if creator configured one
    if (quiz.secretPin && quiz.secretPin !== pin) {
      return NextResponse.json(
        { success: false, error: "Incorrect Secret PIN." },
        { status: 403 }
      );
    }

    await deleteQuiz(id);

    return NextResponse.json({
      success: true,
      message: "Quiz deleted successfully.",
    });
  } catch (err) {
    console.error("[API Quiz DELETE Error]:", err);
    return NextResponse.json(
      { success: false, error: "Failed to delete quiz." },
      { status: 500 }
    );
  }
}
