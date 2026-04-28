import prisma from "../config/prisma";
import {
  IATSRepository,
  SaveATSRecordData,
} from "../interfaces/IATSRepository";

/**
 * SOLID — S (Single Responsibility): Only handles ATSRecord DB operations.
 * SOLID — D (Dependency Inversion): Implements IATSRepository interface.
 *
 * OOP — Encapsulation: All Prisma logic for ATS records lives here.
 */
export class ATSRepository implements IATSRepository {
  async save(data: SaveATSRecordData): Promise<{ id: string }> {
    const record = await prisma.aTSRecord.create({
      data: {
        user: {
          connectOrCreate: {
            where: { id: data.userId },
            create: {
              id: data.userId,
              email: `${data.userId}@clerk.user`,
            },
          },
        },
        score: data.score,
        jobRole: data.jobRole ?? null,
        fileName: data.fileName ?? null,
      },
    });
    return { id: record.id };
  }

  async findByUserId(userId: string): Promise<any[]> {
    return prisma.aTSRecord.findMany({
      where: { userId },
      select: {
        id: true,
        score: true,
        jobRole: true,
        fileName: true,
        createdAt: true,
      },
      orderBy: { createdAt: "asc" },
    });
  }

  async countByUserId(userId: string): Promise<number> {
    return prisma.aTSRecord.count({ where: { userId } });
  }

  async averageScoreByUserId(userId: string): Promise<number> {
    const result = await prisma.aTSRecord.aggregate({
      where: { userId },
      _avg: { score: true },
    });
    return Math.round(result._avg.score ?? 0);
  }
}
