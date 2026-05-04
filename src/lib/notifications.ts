import { db } from './db';

interface CreateNotificationParams {
  userId: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
  category: 'analysis' | 'quiz' | 'system' | 'security' | 'update';
  actionUrl?: string;
  actionText?: string;
}

export async function createNotification({
  userId,
  title,
  message,
  type,
  category,
  actionUrl,
  actionText
}: CreateNotificationParams) {
  try {
    const notification = await (db as any).notification.create({
      data: {
        userId,
        title,
        message,
        type,
        category,
        isRead: false,
        actionUrl: actionUrl || null,
        actionText: actionText || null,
      },
    });
    return notification;
  } catch (error) {
    console.error('Failed to create notification:', error);
    return null;
  }
}

// Helper to create analysis completion notification
export async function createAnalysisNotification(
  userId: string,
  submissionTitle: string,
  trustScore: number
) {
  return createNotification({
    userId,
    title: 'Analysis Complete',
    message: `Your analysis of '${submissionTitle}' has been completed with a trust score of ${trustScore}%`,
    type: 'success',
    category: 'analysis',
    actionUrl: '/dashboard',
    actionText: 'View Results'
  });
}

// Helper to create security alert notification
export async function createSecurityNotification(
  userId: string,
  deviceInfo: string
) {
  return createNotification({
    userId,
    title: 'Security Alert',
    message: `New login detected from ${deviceInfo}`,
    type: 'warning',
    category: 'security',
    actionUrl: '/settings',
    actionText: 'Review'
  });
}
