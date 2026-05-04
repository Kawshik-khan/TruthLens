import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/jwt';
import { db } from "@/lib/db";

// PUT /api/user/notifications/[id]/read - Mark notification as read
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAuth(request);
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    if (!authResult.user) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 });
    }

    const { id: notificationId } = await params;
    const userId = authResult.user.id;

    // Update notification in database, ensuring it belongs to the user
    const updatedNotification = await (db as any).notification.updateMany({
      where: {
        id: notificationId,
        userId: userId, // Ensure user owns this notification
      },
      data: {
        isRead: true,
      },
    });

    if (updatedNotification.count === 0) {
      return NextResponse.json({ error: 'Notification not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Notification marked as read' });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
