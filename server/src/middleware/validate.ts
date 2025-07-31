import { Request, Response, NextFunction } from 'express';
import { z, ZodType, ZodError } from 'zod';

declare global {
  namespace Express {
    interface Request {
      validatedQuery?: any;
      validatedParams?: any;
      validatedBody?: any;
    }
  }
}

export const validateQuery =
  <T>(schema: ZodType<T>) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      return res.status(400).json({
        errors: z.treeifyError(result.error),
        message: 'Invalid query parameters',
      });
    }
    req.validatedQuery = result.data;
    next();
  };

export const validateParams =
  <T>(schema: ZodType<T>) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.params);
    if (!result.success) {
      return res.status(400).json({
        errors: z.treeifyError(result.error),
        message: 'Invalid route parameters',
      });
    }
    req.validatedParams = result.data;
    next();
  };

export const validateBody =
  <T>(schema: ZodType<T>) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        errors: z.treeifyError(result.error),
        message: 'Invalid request body',
      });
    }
    req.validatedBody = result.data;
    next();
  };
