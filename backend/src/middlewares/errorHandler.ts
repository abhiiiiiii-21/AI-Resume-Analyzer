import { Request, Response, NextFunction } from "express";

/**
 * SOLID — S (Single Responsibility): Only responsible for catching and 
 *                                    formatting errors for the client.
 */
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error("❌ API Error:", err.message);

  const status = err.status || 500;
  const message = err.message || "Internal Server Error";

  res.status(status).json({
    success: false,
    error: message,
  });
};

export default errorHandler;