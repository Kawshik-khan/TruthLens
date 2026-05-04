import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/jwt';
import { db } from '@/lib/db';

// GET /api/user/profile - Get user profile
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(request);
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    if (!authResult.user) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 });
    }

    // Fetch full user profile from database
    const user = await (db as any).user.findUnique({
      where: { id: authResult.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        bio: true,
        preferences: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Parse preferences if they exist
    let preferences = {
      emailNotifications: true,
      pushNotifications: false,
      weeklyReports: true,
      theme: "dark",
      language: "en"
    };

    if (user.preferences && typeof user.preferences === 'string') {
      try {
        preferences = JSON.parse(user.preferences);
      } catch (error) {
        console.error('Error parsing preferences:', error);
      }
    }

    const profile = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      bio: user.bio,
      preferences,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/user/profile - Update user profile
export async function PUT(request: NextRequest) {
  try {
    const authResult = await requireAuth(request);
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    if (!authResult.user) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 });
    }

    const body = await request.json();
    const { name, bio, avatar, preferences } = body;

    // Validate input
    if (name && typeof name !== 'string') {
      return NextResponse.json({ error: 'Invalid name' }, { status: 400 });
    }

    if (bio && typeof bio !== 'string') {
      return NextResponse.json({ error: 'Invalid bio' }, { status: 400 });
    }

    if (preferences && typeof preferences !== 'object') {
      return NextResponse.json({ error: 'Invalid preferences' }, { status: 400 });
    }

    // Update user in database
    const updatedUser = await (db as any).user.update({
      where: { id: authResult.user.id },
      data: {
        name: name || undefined,
        bio: bio || null,
        avatar: avatar || null,
        preferences: preferences ? JSON.stringify(preferences) : undefined,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        bio: true,
        preferences: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Parse preferences for response
    let parsedPreferences = {
      emailNotifications: true,
      pushNotifications: false,
      weeklyReports: true,
      theme: "dark",
      language: "en"
    };

    if (updatedUser.preferences && typeof updatedUser.preferences === 'string') {
      try {
        parsedPreferences = JSON.parse(updatedUser.preferences);
      } catch (error) {
        console.error('Error parsing preferences:', error);
      }
    }

    const updatedProfile = {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      avatar: updatedUser.avatar,
      bio: updatedUser.bio,
      preferences: parsedPreferences,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt
    };

    return NextResponse.json(updatedProfile);
  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
