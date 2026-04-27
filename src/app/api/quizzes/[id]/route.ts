import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const quiz = await (db as any).quiz.findUnique({
      where: { id },
      include: {
        questions: {
          orderBy: { order: 'asc' }
        },
        _count: {
          select: { userProgress: true }
        }
      }
    });

    if (!quiz) {
      return NextResponse.json(
        { error: "Quiz not found" },
        { status: 404 }
      );
    }

    // Return quiz without correct answers for regular users
    const quizForUser = {
      ...quiz,
      questions: quiz.questions.map((q: any) => ({
        ...q,
        correctAnswer: undefined,
        explanation: undefined
      })),
      questionCount: quiz.questions.length,
      totalPoints: quiz.questions.reduce((sum: number, q: any) => sum + q.points, 0),
      attemptsCount: quiz._count.userProgress
    };

    return NextResponse.json(quizForUser);
  } catch (error) {
    console.error("Quiz fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { 
      title, 
      description, 
      category, 
      difficulty, 
      timeLimit,
      questions 
    } = body;

    // Check if quiz exists
    const existingQuiz = await (db as any).quiz.findUnique({
      where: { id }
    });

    if (!existingQuiz) {
      return NextResponse.json(
        { error: "Quiz not found" },
        { status: 404 }
      );
    }

    // Validate category and difficulty
    const validCategories = ["SYNTHETIC_MEDIA", "ALGORITHMIC_BIAS", "COGNITIVE_WARFARE", "DATA_ETHICS"];
    const validDifficulties = ["BEGINNER", "INTERMEDIATE", "ADVANCED"];
    
    if (category && !validCategories.includes(category)) {
      return NextResponse.json(
        { error: "Invalid category. Must be: SYNTHETIC_MEDIA, ALGORITHMIC_BIAS, COGNITIVE_WARFARE, DATA_ETHICS" },
        { status: 400 }
      );
    }

    if (difficulty && !validDifficulties.includes(difficulty)) {
      return NextResponse.json(
        { error: "Invalid difficulty. Must be: BEGINNER, INTERMEDIATE, ADVANCED" },
        { status: 400 }
      );
    }

    // Prepare update data
    const updateData: any = {
      updatedAt: new Date()
    };

    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (category) updateData.category = category;
    if (difficulty) updateData.difficulty = difficulty;
    if (timeLimit) updateData.timeLimit = timeLimit;

    // Update quiz
    const updatedQuiz = await (db as any).quiz.update({
      where: { id },
      data: updateData,
      include: {
        questions: {
          orderBy: { order: 'asc' }
        }
      }
    });

    // Update questions if provided
    if (questions && Array.isArray(questions)) {
      // Delete existing questions
      await (db as any).quizQuestion.deleteMany({
        where: { quizId: id }
      });

      // Create new questions
      await (db as any).quizQuestion.createMany({
        data: questions.map((q: any, index: number) => ({
          quizId: id,
          questionText: q.questionText,
          questionType: q.questionType,
          options: q.questionType === "MULTIPLE_CHOICE" ? JSON.stringify(q.options) : null,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
          points: q.points || 1,
          order: index + 1
        }))
      });
    }

    return NextResponse.json(updatedQuiz);
  } catch (error) {
    console.error("Quiz update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // Check if quiz exists
    const existingQuiz = await (db as any).quiz.findUnique({
      where: { id },
      include: {
        _count: {
          select: { userProgress: true }
        }
      }
    });

    if (!existingQuiz) {
      return NextResponse.json(
        { error: "Quiz not found" },
        { status: 404 }
      );
    }

    // Check if quiz has user progress (prevent deletion if it does)
    if (existingQuiz._count.userProgress > 0) {
      return NextResponse.json(
        { 
          error: "Cannot delete quiz - it has user attempts",
          attemptsCount: existingQuiz._count.userProgress
        },
        { status: 409 }
      );
    }

    // Delete quiz and questions (cascade)
    await (db as any).quiz.delete({
      where: { id }
    });

    return NextResponse.json(
      { 
        message: "Quiz deleted successfully",
        quizName: existingQuiz.title
      }
    );
  } catch (error) {
    console.error("Quiz deletion error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
