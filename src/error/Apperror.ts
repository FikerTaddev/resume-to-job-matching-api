export class AppError<T = unknown> extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details: T;

  constructor(
    statusCode: number,
    code: string,
    message: string,
    details: T = null as unknown as T,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;

    // Fixes the prototype chain for custom classes extending Error
    Object.setPrototypeOf(this, new.target.prototype);

    // Captures clean stack traces
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

// Subclass for specific Bad Requests (400)
export class BadRequestError extends AppError {
  constructor(message = 'Bad Request', code = 'BAD_REQUEST') {
    super(400, code, message);
  }
}

// Subclass for Not Found (404)
export class NotFoundError extends AppError {
  constructor(message = 'Resource not found', code = 'NOT_FOUND') {
    super(404, code, message);
  }
}
