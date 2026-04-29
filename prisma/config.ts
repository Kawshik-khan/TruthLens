import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  // For Prisma 7, we need to specify the database URL via environment variables
  // The schema.prisma file has the datasource block removed as per Prisma 7 requirements
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
