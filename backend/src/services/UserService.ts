import { IUserRepository } from "../interfaces/IUserRepository";

/**
 * SOLID — S (Single Responsibility): Only responsible for user business logic.
 *                                    No HTTP code. No Prisma code. Just rules.
 * SOLID — D (Dependency Inversion): Depends on IUserRepository (interface),
 *                                   not UserRepository (class).
 *
 * OOP — Encapsulation: Business rules like email validation live here,
 *                      not scattered in the controller.
 */
export class UserService {
  // D principle — receives interface in constructor, not a concrete class
  constructor(private userRepository: IUserRepository) {}

  async syncUser(id: string, email: string): Promise<void> {

    if (!email || !email.includes("@")) {
      throw new Error("A valid email address is required.");
    }


    if (!id || id.trim().length === 0) {
      throw new Error("User ID is required.");
    }

    await this.userRepository.upsert({ id, email });
  }

  async getUser(id: string): Promise<any> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new Error("User not found.");
    }

    return user;
  }
}