import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/jwt';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';

// POST /api/user/change-password - Change user password
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth(request);
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    if (!authResult.user) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 });
    }

    const { currentPassword, newPassword } = await request.json();

    // Validate input
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Current password and new password are required' },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: 'New password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // Get user with password from database
    const user = await (db as any).user.findUnique({
      where: { id: authResult.user.id },
      select: { password: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Verify current password
    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Current password is incorrect' },
        { status: 400 }
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password in database
    await (db as any).user.update({
      where: { id: authResult.user.id },
      data: { password: hashedPassword }
    });

    return NextResponse.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
