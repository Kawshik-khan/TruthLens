import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || "";
    const difficulty = searchParams.get("difficulty") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    // Build where clause
    const where: any = {};
    
    if (category) {
      where.category = category;
    }
    
    if (difficulty) {
      where.difficulty = difficulty;
    }

    // Execute query with pagination
    const [quizzes, total] = await Promise.all([
      (db as any).quiz.findMany({
        where,
        include: {
          questions: {
            orderBy: { order: 'asc' }
          },
          _count: {
            select: { userProgress: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      (db as any).quiz.count({ where })
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    return NextResponse.json({
      quizzes: quizzes.map((quiz: any) => ({
        ...quiz,
        questionCount: quiz.questions.length,
        totalPoints: quiz.questions.reduce((sum: number, q: any) => sum + q.points, 0),
        attemptsCount: quiz._count.userProgress
      })),
      pagination: {
        currentPage: page,
        totalPages,
        totalQuizzes: total,
        hasNext,
        hasPrev,
        limit
      }
    });
  } catch (error) {
    console.error("Quizzes fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      title, 
      description, 
      category, 
      difficulty, 
      timeLimit,
      questions 
    } = body;

    // Validate required fields
    if (!title || !description || !category || !difficulty || !timeLimit || !questions) {
      return NextResponse.json(
        { error: "Missing required fields: title, description, category, difficulty, timeLimit, questions" },
        { status: 400 }
      );
    }

    // Validate category and difficulty
    const validCategories = ["SYNTHETIC_MEDIA", "ALGORITHMIC_BIAS", "COGNITIVE_WARFARE", "DATA_ETHICS"];
    const validDifficulties = ["BEGINNER", "INTERMEDIATE", "ADVANCED"];
    
    if (!validCategories.includes(category)) {
      return NextResponse.json(
        { error: "Invalid category. Must be: SYNTHETIC_MEDIA, ALGORITHMIC_BIAS, COGNITIVE_WARFARE, DATA_ETHICS" },
        { status: 400 }
      );
    }

    if (!validDifficulties.includes(difficulty)) {
      return NextResponse.json(
        { error: "Invalid difficulty. Must be: BEGINNER, INTERMEDIATE, ADVANCED" },
        { status: 400 }
      );
    }

    // Validate questions
    if (!Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json(
        { error: "Questions must be a non-empty array" },
        { status: 400 }
      );
    }

    // Create quiz with questions
    const quiz = await (db as any).quiz.create({
      data: {
        title,
        description,
        category,
        difficulty,
        timeLimit,
        questions: {
          create: questions.map((q: any, index: number) => ({
            questionText: q.questionText,
            questionType: q.questionType,
            options: q.questionType === "MULTIPLE_CHOICE" ? JSON.stringify(q.options) : null,
            correctAnswer: q.correctAnswer,
            explanation: q.explanation,
            points: q.points || 1,
            order: index + 1
          }))
        }
      },
      include: {
        questions: {
          orderBy: { order: 'asc' }
        }
      }
    });

    return NextResponse.json(quiz, { status: 201 });
  } catch (error) {
    console.error("Quiz creation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
