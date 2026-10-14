import test from "node:test";
import assert from "node:assert/strict";
import { DEFAULT_QUIZ_QUESTIONS } from "../lib/quiz/questions.ts";
import { saveQuiz, getQuizById, getQuizPublicData, recordAttempt, getScoreboard, deleteAttempt, deleteQuiz } from "../lib/quiz/storage.ts";
import { QuizData, PlayerAttempt } from "../lib/quiz/types.ts";

test("Quiz Domain: Questions bank has valid structure and unique IDs", () => {
  assert.ok(DEFAULT_QUIZ_QUESTIONS.length >= 10, "Should have at least 10 questions");
  const idSet = new Set<string>();

  for (const q of DEFAULT_QUIZ_QUESTIONS) {
    assert.ok(q.id, "Question must have an id");
    assert.ok(!idSet.has(q.id), `Duplicate question id: ${q.id}`);
    idSet.add(q.id);

    assert.ok(q.question.trim().length > 5, "Question text must be meaningful");
    assert.equal(q.options.length, 4, "Every question must have 4 options");
    const optionIds = q.options.map((o) => o.id);
    assert.deepEqual(optionIds, [0, 1, 2, 3], "Option IDs must be 0, 1, 2, 3");
  }
});

test("Quiz Storage: Quiz creation, public sanitization, attempts and scoreboard", async () => {
  const quizId = "test_quiz_101";
  const mockQuiz: QuizData = {
    id: quizId,
    slug: "ali-challenge-101",
    creatorName: "Ali",
    gender: "male",
    country: "PK",
    theme: "dont_block_me",
    secretPin: "9999",
    createdAt: Date.now(),
    questions: [
      {
        questionId: "q1",
        question: "Secret talent?",
        emoji: "🎭",
        options: [
          { id: 0, text: "Bathroom Singer" },
          { id: 1, text: "Biryani Expert" },
          { id: 2, text: "Sleeping" },
          { id: 3, text: "Gamer" },
        ],
        correctOptionId: 1, // Biryani Expert
      },
      {
        questionId: "q2",
        question: "Favourite food?",
        emoji: "🍕",
        options: [
          { id: 0, text: "Biryani" },
          { id: 1, text: "Pizza" },
          { id: 2, text: "Chai" },
          { id: 3, text: "Chaat" },
        ],
        correctOptionId: 0, // Biryani
      },
    ],
  };

  // 1. Save Quiz
  await saveQuiz(mockQuiz);
  const retrieved = await getQuizById(quizId);
  assert.ok(retrieved, "Retrieved quiz should exist");
  assert.equal(retrieved.creatorName, "Ali");
  assert.equal(retrieved.secretPin, "9999");

  // 2. Public data must NOT reveal correctOptionId or secretPin
  const publicData = await getQuizPublicData(quizId);
  assert.ok(publicData);
  assert.equal(publicData.creatorName, "Ali");
  assert.equal((publicData as unknown as Record<string, unknown>).secretPin, undefined, "Secret PIN must not be in public data");
  for (const q of publicData.questions) {
    assert.equal((q as unknown as Record<string, unknown>).correctOptionId, undefined, "correctOptionId must not be leaked to public/friend");
  }

  // 3. Record Attempts
  // Bestie Attempt (2/2 = 100%)
  const attemptBestie: PlayerAttempt = {
    id: "att_1",
    quizId,
    playerName: "Hamza",
    score: 2,
    totalQuestions: 2,
    answers: [
      { questionId: "q1", selectedOptionId: 1, isCorrect: true },
      { questionId: "q2", selectedOptionId: 0, isCorrect: true },
    ],
    createdAt: Date.now(),
  };
  await recordAttempt(attemptBestie);

  // Fake Friend Attempt (0/2 = 0%)
  const attemptFake: PlayerAttempt = {
    id: "att_2",
    quizId,
    playerName: "Bilal",
    score: 0,
    totalQuestions: 2,
    answers: [
      { questionId: "q1", selectedOptionId: 0, isCorrect: false },
      { questionId: "q2", selectedOptionId: 1, isCorrect: false },
    ],
    createdAt: Date.now() + 1000,
  };
  await recordAttempt(attemptFake);

  // 4. Verify Scoreboard
  const scoreboard = await getScoreboard(quizId);
  assert.equal(scoreboard.length, 2);

  const hamzaEntry = scoreboard.find((e) => e.playerName === "Hamza");
  assert.ok(hamzaEntry);
  assert.equal(hamzaEntry.score, 2);
  assert.equal(hamzaEntry.statusBadge, "bestie");

  const bilalEntry = scoreboard.find((e) => e.playerName === "Bilal");
  assert.ok(bilalEntry);
  assert.equal(bilalEntry.score, 0);
  assert.equal(bilalEntry.statusBadge, "fake");

  // 5. Delete an Attempt
  const deleted = await deleteAttempt(quizId, "att_2");
  assert.ok(deleted, "Attempt should be deleted");
  const scoreboardAfterDelete = await getScoreboard(quizId);
  assert.equal(scoreboardAfterDelete.length, 1);
  assert.equal(scoreboardAfterDelete[0].playerName, "Hamza");

  // Cleanup
  await deleteQuiz(quizId);
  assert.equal(await getQuizById(quizId), null, "Quiz should be deleted");
});
