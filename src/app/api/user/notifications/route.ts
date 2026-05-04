import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/jwt';
import { db } from "@/lib/db";

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

    // Build where clause
    const where: any = { userId: user.id };
    
    if (filter === 'unread') {
      where.isRead = false;
    } else if (filter === 'read') {
      where.isRead = true;
    }
    
    if (category !== 'all') {
      where.category = category;
    }

    // Fetch notifications from database
    const notifications = await (db as any).notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/user/notifications - Create a new notification (admin/system use)
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth(request);
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    if (!authResult.user) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 });
    }

    const body = await request.json();
    const { title, message, type, category, actionUrl, actionText, targetUserId } = body;

    if (!title || !message || !type || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create notification in database
    const newNotification = await (db as any).notification.create({
      data: {
        userId: targetUserId || authResult.user.id,
        title,
        message,
        type,
        category,
        isRead: false,
        actionUrl: actionUrl || null,
        actionText: actionText || null,
      },
    });

    return NextResponse.json(newNotification, { status: 201 });
  } catch (error) {
    console.error('Error creating notification:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
