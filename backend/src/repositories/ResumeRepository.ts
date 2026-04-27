import prisma from "../config/prisma";
import { IResumeRepository, SaveResumeData } from "../interfaces/IResumeRepository";

/**
 * SOLID — S (Single Responsibility): Only responsible for Resume database operations.
 * SOLID — D (Dependency Inversion): Implements IResumeRepository interface.
 *
 * OOP — Encapsulation: All Prisma and database logic for resumes lives here.
 *                      ResumeService never touches Prisma directly — it only
 *                      calls methods on this class via the IResumeRepository interface.
 */
export class ResumeRepository implements IResumeRepository {
  // Save a new resume record to the database
  async save(data: SaveResumeData): Promise<{ id: string }> {
    const resume = await prisma.resume.create({
      data: {
        userId: data.userId,
        originalText: data.originalText,
        enhancedText: data.enhancedText,
        jobDescription: data.jobDescription,
        pdfUrl: data.pdfUrl,
      },
    });

    return { id: resume.id };
  }

  // Get all resumes for a specific user (for dashboard)
  async findByUserId(userId: string): Promise<any[]> {
    return prisma.resume.findMany({
      where: { userId },
      select: {
        id: true,
        jobDescription: true,
        pdfUrl: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" }, // Newest first
    });
  }

  // Get one resume by its ID
  async findById(id: string): Promise<any | null> {
    return prisma.resume.findUnique({
      where: { id },
    });
  }
}