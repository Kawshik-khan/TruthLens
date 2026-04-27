import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

const secret = new TextEncoder().encode(process.env.AUTH_SECRET);

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify user authentication
    const token = (await cookies()).get("auth_token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { payload } = await jwtVerify(token, secret);
    const userId = payload.sub as string;
    const { id } = await params;

    const body = await request.json();
    const { answers } = body;

    if (!answers || !Array.isArray(answers)) {
      return NextResponse.json(
        { error: "Missing or invalid answers array" },
        { status: 400 }
      );
    }

    // Get quiz with questions and correct answers
    const quiz = await (db as any).quiz.findUnique({
      where: { id },
      include: {
        questions: {
          orderBy: { order: 'asc' }
        }
      }
    });

    if (!quiz) {
      return NextResponse.json(
        { error: "Quiz not found" },
        { status: 404 }
      );
    }

    // Check if user has already completed this quiz
    const existingProgress = await (db as any).userQuizProgress.findFirst({
      where: {
        userId,
        quizId: id
      }
    });

    if (existingProgress && existingProgress.completedAt) {
      return NextResponse.json(
        { error: "Quiz already completed" },
        { status: 409 }
      );
    }

    // Calculate score
    let totalScore = 0;
    let totalPoints = 0;
    const results: Array<{
      questionId: string;
      questionText: string;
      userAnswer: string;
      correctAnswer: string;
      isCorrect: boolean;
      points: number;
      explanation?: string;
    }> = [];

    quiz.questions.forEach((question: any, index: number) => {
      const userAnswer = answers[index]?.answer || "";
      const isCorrect = userAnswer.toLowerCase().trim() === question.correctAnswer.toLowerCase().trim();
      
      if (isCorrect) {
        totalScore += question.points;
      }
      
      totalPoints += question.points;

      results.push({
        questionId: question.id,
        questionText: question.questionText,
        userAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect,
        points: question.points,
        explanation: question.explanation || undefined
      });
    });

    const scorePercentage = Math.round((totalScore / totalPoints) * 100);

    // Create or update user progress
    const progress = await (db as any).userQuizProgress.upsert({
      where: {
        userId_quizId: {
          userId,
          quizId: id
        }
      },
      update: {
        score: totalScore,
        totalPoints,
        completedAt: new Date()
      },
      create: {
        userId,
        quizId: id,
        score: totalScore,
        totalPoints,
        completedAt: new Date()
      }
    });

    // Determine performance level
    let performanceLevel = "NEEDS_IMPROVEMENT";
    if (scorePercentage >= 90) performanceLevel = "EXCELLENT";
    else if (scorePercentage >= 80) performanceLevel = "GOOD";
    else if (scorePercentage >= 70) performanceLevel = "SATISFACTORY";

    return NextResponse.json({
      success: true,
      score: totalScore,
      totalPoints,
      scorePercentage,
      performanceLevel,
      results,
      progress: {
        id: progress.id,
        completedAt: progress.completedAt,
        startedAt: progress.startedAt
      },
      quiz: {
        title: quiz.title,
        category: quiz.category,
        difficulty: quiz.difficulty
      }
    });
  } catch (error) {
    console.error("Quiz submission error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
