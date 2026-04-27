import { Request, Response } from "express";
import { UserService } from "../services/UserService";
import { UserRepository } from "../repositories/UserRepository";

/**
 * SOLID — S (Single Responsibility): Only responsible for handling HTTP for user routes.
 *   - Reads from req (request)
 *   - Calls UserService
 *   - Writes to res (response)
 *   - That's it. No business logic. No DB queries.
 *
 * OOP — Encapsulation: UserService is created once in the constructor.
 *                      Routes just call controller methods.
 */
export class UserController {
  private userService: UserService;

  constructor() {
    // Wire up: Controller → Service → Repository
    // D principle: UserService receives UserRepository as IUserRepository interface
    this.userService = new UserService(new UserRepository());
  }

  /**
   * POST /api/user/sync
   *
   * Call this from your frontend RIGHT AFTER Clerk login.
   * It creates the user in our Neon DB if they don't exist yet,
   * or updates their email if they do.
   *
   * Body: { id: string, email: string }
   */
  sync = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id, email } = req.body;

      if (!id || !email) {
        res.status(400).json({ error: "id and email are required." });
        return;
      }

      await this.userService.syncUser(id, email);

      res.status(200).json({ success: true, message: "User synced successfully." });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  };

  /**
   * GET /api/user/me
   *
   * Returns the current authenticated user's profile from our DB.
   * Requires clerkAuth middleware (userId comes from the verified token).
   */
  getMe = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).userId; // Set by clerkAuth middleware

      const user = await this.userService.getUser(userId);

      res.status(200).json({ success: true, data: user });
    } catch (err: any) {
      res.status(404).json({ error: err.message });
    }
  };
}