import { NextResponse } from "next/server";
import { getQuizById, recordAttempt } from "@/lib/quiz/storage";
import { PlayerAttempt } from "@/lib/quiz/types";

export const dynamic = "force-dynamic";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { playerName, answers } = body;

    if (!playerName || typeof playerName !== "string" || !playerName.trim()) {
      return NextResponse.json(
        { success: false, error: "Please enter your name." },
        { status: 400 }
      );
    }

    const quiz = await getQuizById(id);
    if (!quiz) {
      return NextResponse.json(
        { success: false, error: "Quiz not found." },
        { status: 404 }
      );
    }

    if (!answers || !Array.isArray(answers)) {
      return NextResponse.json(
        { success: false, error: "Invalid answers submitted." },
        { status: 400 }
      );
    }

    // Calculate score
    let score = 0;
    const evaluatedAnswers = answers.map((ans: { questionId: string; selectedOptionId: number }) => {
      const targetQuestion = quiz.questions.find((q) => q.questionId === ans.questionId);
      const isCorrect = targetQuestion ? targetQuestion.correctOptionId === ans.selectedOptionId : false;
      if (isCorrect) score++;

      return {
        questionId: ans.questionId,
        selectedOptionId: ans.selectedOptionId,
        isCorrect,
      };
    });

    const attemptId = `att_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const attempt: PlayerAttempt = {
      id: attemptId,
      quizId: id,
      playerName: playerName.trim(),
      score,
      totalQuestions: quiz.questions.length,
      answers: evaluatedAnswers,
      createdAt: Date.now(),
    };

    await recordAttempt(attempt);

    return NextResponse.json({
      success: true,
      score,
      totalQuestions: quiz.questions.length,
      creatorName: quiz.creatorName,
      gender: quiz.gender,
      attemptId: attempt.id,
    });
  } catch (err) {
    console.error("[API Quiz Attempt Error]:", err);
    return NextResponse.json(
      { success: false, error: "Failed to record attempt." },
      { status: 500 }
    );
  }
}
