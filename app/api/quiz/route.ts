import { NextResponse } from "next/server";
import { saveQuiz } from "@/lib/quiz/storage";
import { QuizData, Gender } from "@/lib/quiz/types";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { creatorName, gender, country, secretPin, questions } = body;

    if (!creatorName || typeof creatorName !== "string" || !creatorName.trim()) {
      return NextResponse.json(
        { success: false, error: "Please enter your name." },
        { status: 400 }
      );
    }

    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json(
        { success: false, error: "Quiz must have at least one question." },
        { status: 400 }
      );
    }

    // Generate unique ID and clean slug
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 7);
    const cleanName = creatorName
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    const slug = `${cleanName || "quiz"}-${randomSuffix}`;
    const id = `q_${timestamp}_${randomSuffix}`;

    const quiz: QuizData = {
      id,
      slug,
      creatorName: creatorName.trim(),
      gender: (gender === "female" ? "female" : "male") as Gender,
      country: country || "PK",
      theme: "dont_block_me",
      secretPin: secretPin ? String(secretPin).trim() : "1234",
      createdAt: timestamp,
      questions: questions.map((q: { questionId: string; question: string; emoji?: string; options: Array<{ id: number; text: string }>; correctOptionId: number }) => ({
        questionId: q.questionId,
        question: q.question,
        emoji: q.emoji,
        options: q.options,
        correctOptionId: Number(q.correctOptionId),
      })),
    };

    await saveQuiz(quiz);

    return NextResponse.json({
      success: true,
      quizId: quiz.id,
      slug: quiz.slug,
      shareUrl: `/quiz/share/${quiz.id}`,
    });
  } catch (err) {
    console.error("[API Quiz POST Error]:", err);
    return NextResponse.json(
      { success: false, error: "Failed to create quiz." },
      { status: 500 }
    );
  }
}
