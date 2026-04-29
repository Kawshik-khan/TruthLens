import { NextRequest, NextResponse } from 'next/server';

// PUT /api/user/notifications/[id]/read - Mark notification as read
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const notificationId = params.id;

    // Mock response - in production, verify notification exists and belongs to user
    const updatedNotification = {
      id: notificationId,
      userId: "user_123",
      title: "Analysis Complete",
      message: "Your analysis has been completed",
      type: "success",
      category: "analysis",
      isRead: true,
      actionUrl: "/dashboard",
      actionText: "View Results",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json(updatedNotification);
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
