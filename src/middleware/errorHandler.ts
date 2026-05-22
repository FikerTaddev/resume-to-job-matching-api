import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../error/Apperror.js';
import {
  AppErrorResponse,
  ValidationErrorDetail,
} from '../types/AppErrorResponse.js';

export const globalErrorHandler: ErrorRequestHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  let statusCode = 500;
  let code = 'INTERNAL_SERVER_ERROR';
  let message = 'Something went wrong on our end.';
  let details: unknown = null;
  let stack: string | undefined = undefined;

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    code = err.code;
    message = err.message;
    details = err.details;
    stack = err.stack;
  } else if (err instanceof ZodError) {
    statusCode = 400;
    code = 'VALIDATION_ERROR';
    message = 'The data provided invalid parameters.';

    const formattedDetails: ValidationErrorDetail[] = err.issues.map(
      (issue) => ({
        field: issue.path.join('.'),
        issue: issue.message,
      }),
    );

    details = formattedDetails;
    stack = err.stack;
  } else if (err instanceof Error) {
    stack = err.stack;

    if (process.env.NODE_ENV === 'development') {
      message = err.message;
    }
  }

  const response: AppErrorResponse = {
    success: false,
    error: {
      code,
      message,
      ...(process.env.NODE_ENV === 'development' ? { stack } : undefined),
    },
  };

  if (details) {
    response.error.details = details;
  }

  if (statusCode === 500) {
    console.error('Critical Uncaught System Failure:', err);
  }

  res.status(statusCode).json(response);
};
