import { NextResponse } from "next/server";
import { getScoreboard, getQuizById, deleteAttempt } from "@/lib/quiz/storage";

export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const quiz = await getQuizById(id);

    if (!quiz) {
      return NextResponse.json(
        { success: false, error: "Quiz not found." },
        { status: 404 }
      );
    }

    const leaderboard = await getScoreboard(id);

    return NextResponse.json({
      success: true,
      creatorName: quiz.creatorName,
      totalQuestions: quiz.questions.length,
      scoreboard: leaderboard,
    });
  } catch (err) {
    console.error("[API Quiz Scoreboard Error]:", err);
    return NextResponse.json(
      { success: false, error: "Failed to load scoreboard." },
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
    const body = await req.json();
    const { attemptId, pin } = body;

    const quiz = await getQuizById(id);
    if (!quiz) {
      return NextResponse.json(
        { success: false, error: "Quiz not found." },
        { status: 404 }
      );
    }

    if (quiz.secretPin && quiz.secretPin !== pin) {
      return NextResponse.json(
        { success: false, error: "Incorrect Secret PIN." },
        { status: 403 }
      );
    }

    const deleted = await deleteAttempt(id, attemptId);

    return NextResponse.json({
      success: deleted,
      message: deleted ? "Attempt removed." : "Attempt not found.",
    });
  } catch (err) {
    console.error("[API Quiz Scoreboard DELETE Error]:", err);
    return NextResponse.json(
      { success: false, error: "Failed to delete attempt." },
      { status: 500 }
    );
  }
}
