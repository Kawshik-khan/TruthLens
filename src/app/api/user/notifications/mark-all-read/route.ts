import { NextRequest, NextResponse } from 'next/server';

// PUT /api/user/notifications/mark-all-read - Mark all notifications as read
export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Mock response - in production, update all notifications for user
    const result = {
      message: 'All notifications marked as read',
      count: 2 // Mock count of unread notifications that were marked as read
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
