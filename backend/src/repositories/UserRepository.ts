import prisma from "../config/prisma";
import { IUserRepository, SyncUserData } from "../interfaces/IUserRepository";

/**
 * SOLID — S (Single Responsibility): Only responsible for User database operations.
 * SOLID — D (Dependency Inversion): Implements IUserRepository interface.
 *
 * OOP — Encapsulation: All Prisma and database logic for users lives here.
 *                      UserService never touches Prisma directly — it only
 *                      calls methods on this class via the IUserRepository interface.
 */
export class UserRepository implements IUserRepository {
  /**
   * Upsert = INSERT if not exists, UPDATE if exists.
   * Safe to call on every login — won't create duplicate users.
   */
  async upsert(data: SyncUserData): Promise<void> {
    await prisma.user.upsert({
      where: { id: data.id },
      update: { email: data.email },
      create: { id: data.id, email: data.email },
    });
  }

  async findById(id: string): Promise<any | null> {
    return prisma.user.findUnique({
      where: { id },
    });
  }
}