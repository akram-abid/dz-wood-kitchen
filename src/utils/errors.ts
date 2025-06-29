export class HttpError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean = true;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends HttpError {
  constructor(message: string = "Bad Request") {
    super(message, 400);
  }
}

export class UnauthorizedError extends HttpError {
  constructor(message: string = "Unauthorized") {
    super(message, 401);
  }
}

export class ForbiddenError extends HttpError {
  constructor(message: string = "Forbidden") {
    super(message, 403);
  }
}

export class NotFoundError extends HttpError {
  constructor(message: string = "Resource not found") {
    super(message, 404);
  }
}

export class ConflictError extends HttpError {
  constructor(message: string = "Conflict") {
    super(message, 409);
  }
}

export class ValidationError extends HttpError {
  public readonly field?: string;
  public readonly code?: string;

  constructor(message: string, field?: string, code?: string) {
    super(message, 400);
    this.field = field;
    this.code = code;
  }
}

export class InternalServerError extends HttpError {
  constructor(message: string = "Internal Server Error") {
    super(message, 500);
  }
}
