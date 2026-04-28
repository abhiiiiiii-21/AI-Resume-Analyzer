import prisma from "../config/prisma";
import {
  IPDFExportRepository,
  SavePDFExportData,
} from "../interfaces/IPDFExportRepository";

/**
 * SOLID — S (Single Responsibility): Only handles PDFExport DB operations.
 * SOLID — D (Dependency Inversion): Implements IPDFExportRepository interface.
 *
 * OOP — Encapsulation: All Prisma logic for PDF exports lives here.
 */
export class PDFExportRepository implements IPDFExportRepository {
  async save(data: SavePDFExportData): Promise<{ id: string }> {
    const record = await prisma.pDFExport.create({
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
        type: data.type,
        pdfUrl: data.pdfUrl,
        title: data.title ?? null,
      },
    });
    return { id: record.id };
  }

  async findByUserId(userId: string): Promise<any[]> {
    return prisma.pDFExport.findMany({
      where: { userId },
      select: {
        id: true,
        type: true,
        pdfUrl: true,
        title: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async countByUserId(userId: string): Promise<number> {
    return prisma.pDFExport.count({ where: { userId } });
  }
}
