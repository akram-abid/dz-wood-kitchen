import {
  HttpError,
  NotFoundError,
  BadRequestError,
  ConflictError,
  ValidationError,
  UnauthorizedError,
  InternalServerError,
} from "./errors";

export const SERVICE_ERRORS = {
  MAX_IMAGES: "MAX_IMAGES",
  POST_NOT_FOUND: "POST_NOT_FOUND",
  USER_ALREADY_EXISTS: "USER_ALREADY_EXISTS",
  INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
  USER_NOT_FOUND: "USER_NOT_FOUND",
  SIGNUP_FAILED: "SIGNUP_FAILED",
  LOGIN_FAILED: "LOGIN_FAILED",
  INVALID_TOKEN: "INVALID_TOKEN",
  TOKEN_EXPIRED: "TOKEN_EXPIRED",
  UNSPORTED_FILE_TYPE: "UNSPORTED_FILE_TYPE",
} as const;

const SERVICE_ERROR_MAP = {
  [SERVICE_ERRORS.USER_ALREADY_EXISTS]: () =>
    new ConflictError("User already exists with this email"),
  [SERVICE_ERRORS.INVALID_CREDENTIALS]: () =>
    new UnauthorizedError("Invalid email or password"),
  [SERVICE_ERRORS.USER_NOT_FOUND]: () => new NotFoundError("User not found"),
  [SERVICE_ERRORS.SIGNUP_FAILED]: () =>
    new InternalServerError("Failed to create user account"),
  [SERVICE_ERRORS.LOGIN_FAILED]: () => new InternalServerError("Login failed"),
  [SERVICE_ERRORS.INVALID_TOKEN]: () => new UnauthorizedError("Invalid token"),
  [SERVICE_ERRORS.TOKEN_EXPIRED]: () => new UnauthorizedError("Token expired"),
  [SERVICE_ERRORS.POST_NOT_FOUND]: () =>
    new NotFoundError("Post not found or maybe deleted"),
  [SERVICE_ERRORS.MAX_IMAGES]: () =>
    new BadRequestError("Maximum allowed messages is 15"),
  [SERVICE_ERRORS.UNSPORTED_FILE_TYPE]: () =>
    new UnauthorizedError("Unsported File Types"),
};

function mapServiceError(error: Error): HttpError {
  const errorMapper =
    SERVICE_ERROR_MAP[error.message as keyof typeof SERVICE_ERROR_MAP];
  return errorMapper
    ? errorMapper()
    : new InternalServerError("Something went wrong");
}

export function handleControllerError(
  error: any,
  context: string,
  logger: any,
) {
  if (error instanceof HttpError) {
    logger.warn({
      error: error.message,
      context,
      statusCode: error.statusCode,
    });
    throw error;
  }

  logger.error({ error: error.message, context, stack: error.stack });

  const mappedError = mapServiceError(error);
  throw mappedError;
}
