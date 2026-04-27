import { Request, Response, NextFunction } from "express";
import { verifyToken } from "@clerk/backend";
import dotenv from "dotenv";
dotenv.config();

/**
 * SOLID — S (Single Responsibility): Only responsible for verifying Clerk tokens.
 */
export const clerkAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ error: "No authorization token provided." });
      return;
    }

    const token = authHeader.split(" ")[1];

    // Verify token with Clerk — throws if invalid or expired
    const payload = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY!,
    });

    // Attach the Clerk user ID to the request for use in controllers
    (req as any).userId = payload.sub;

    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token. Please log in again." });
  }
};