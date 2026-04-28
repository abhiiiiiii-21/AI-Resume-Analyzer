import prisma from "../config/prisma";
import {
  IResumeBuilderRepository,
  SaveDraftData,
  UpdateDraftData,
} from "../interfaces/IResumeBuilderRepository";

/**
 * SOLID — S (Single Responsibility): Only handles ResumeBuilderDraft DB operations.
 * SOLID — D (Dependency Inversion): Implements IResumeBuilderRepository interface.
 *
 * OOP — Encapsulation: All Prisma logic for drafts lives here.
 *                      Services never access Prisma directly — only via this class.
 */
export class ResumeBuilderRepository implements IResumeBuilderRepository {
  async create(data: SaveDraftData): Promise<{ id: string }> {
    const draft = await prisma.resumeBuilderDraft.create({
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
        title: data.title,
        data: data.data as any,
        theme: data.theme,
      },
    });
    return { id: draft.id };
  }

  async update(
    id: string,
    userId: string,
    data: UpdateDraftData
  ): Promise<{ id: string }> {
    const draft = await prisma.resumeBuilderDraft.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.data !== undefined && { data: data.data as any }),
        ...(data.theme !== undefined && { theme: data.theme }),
      },
    });
    return { id: draft.id };
  }

  async findByUserId(userId: string): Promise<any[]> {
    return prisma.resumeBuilderDraft.findMany({
      where: { userId },
      select: {
        id: true,
        title: true,
        theme: true,
        updatedAt: true,
        createdAt: true,
      },
      orderBy: { updatedAt: "desc" },
    });
  }

  async findById(id: string, userId: string): Promise<any | null> {
    return prisma.resumeBuilderDraft.findFirst({
      where: { id, userId },
    });
  }

  async delete(id: string, userId: string): Promise<void> {
    await prisma.resumeBuilderDraft.deleteMany({
      where: { id, userId },
    });
  }

  async countByUserId(userId: string): Promise<number> {
    return prisma.resumeBuilderDraft.count({ where: { userId } });
  }
}
