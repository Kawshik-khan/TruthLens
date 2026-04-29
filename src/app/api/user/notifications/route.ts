import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/jwt';

// GET /api/user/notifications - Get all notifications for the authenticated user
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(request);
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    if (!authResult.user) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 });
    }

    const user = authResult.user;

    // Get query parameters for filtering
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get('filter') || 'all';
    const category = searchParams.get('category') || 'all';

    // Mock notifications data with proper user ID
    const mockNotifications = [
      {
        id: "1",
        userId: user.id,
        title: "Analysis Complete",
        message: "Your analysis of 'Climate Change Article' has been completed with a trust score of 85%",
        type: "success",
        category: "analysis",
        isRead: false,
        actionUrl: "/dashboard",
        actionText: "View Results",
        createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: "2",
        userId: user.id,
        title: "Quiz Available",
        message: "New quiz 'Media Literacy Basics' is now available in the Education module",
        type: "info",
        category: "quiz",
        isRead: false,
        actionUrl: "/learn/quizzes",
        actionText: "Take Quiz",
        createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: "3",
        userId: user.id,
        title: "System Update",
        message: "TruthLens has been updated with new features and improvements",
        type: "info",
        category: "update",
        isRead: true,
        actionUrl: "/methodology",
        actionText: "Learn More",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: "4",
        userId: user.id,
        title: "Security Alert",
        message: "New login detected from Chrome on Windows",
        type: "warning",
        category: "security",
        isRead: true,
        actionUrl: "/settings",
        actionText: "Review",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    // Apply filters
    let filteredNotifications = mockNotifications;

    if (filter === 'unread') {
      filteredNotifications = filteredNotifications.filter(n => !n.isRead);
    } else if (filter === 'read') {
      filteredNotifications = filteredNotifications.filter(n => n.isRead);
    }

    if (category !== 'all') {
      filteredNotifications = filteredNotifications.filter(n => n.category === category);
    }

    return NextResponse.json(filteredNotifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/user/notifications - Create a new notification
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, message, type, category, actionUrl, actionText } = body;

    if (!title || !message || !type || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Mock created notification
    const newNotification = {
      id: Date.now().toString(),
      userId: "user_123",
      title,
      message,
      type,
      category,
      isRead: false,
      actionUrl: actionUrl || null,
      actionText: actionText || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json(newNotification, { status: 201 });
  } catch (error) {
    console.error('Error creating notification:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
