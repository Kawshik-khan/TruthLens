import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/jwt';

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

    const user = authResult.user;

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

    const user = authResult.user;
    const body = await request.json();
    const { name, bio, preferences } = body;

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

    // For now, return mock updated profile with real user ID
    // In production, you would:
    // const updatedUser = await prisma.user.update({
    //   where: { id: user.id },
    //   data: { name, bio, preferences: JSON.stringify(preferences) }
    // });

    const updatedProfile = {
      id: user.id,
      name: name || user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      bio: bio || user.bio,
      preferences: preferences || {
        emailNotifications: true,
        pushNotifications: false,
        weeklyReports: true,
        theme: "dark",
        language: "en"
      },
      createdAt: user.createdAt,
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json(updatedProfile);
  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
