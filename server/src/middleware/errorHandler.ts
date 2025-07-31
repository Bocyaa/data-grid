import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.log('[ERROR]', err);

  // Zod validation error
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      data: null,
      message: 'Validation error',
      errors: z.treeifyError(err),
    });
  }

  // Known custom error
  if (err.status && err.message) {
    return res.status(err.status).json({
      success: false,
      data: null,
      message: err.message,
    });
  }

  // Fallback generic error
  res.status(500).json({
    success: false,
    data: null,
    message: 'Internal server error',
  });
}
