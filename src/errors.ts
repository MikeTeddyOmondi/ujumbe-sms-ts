// src/errors.ts

/**
 * Custom error class for UjumbeSMS-related errors
 */
export class UjumbeSmsError extends Error {
  /**
   * Error code if available
   */
  code?: string;

  /**
   * HTTP status code if applicable
   */
  statusCode?: number;

  /**
   * Original error that was caught
   */
  originalError?: unknown;

  /**
   * Creates a new UjumbeSMS error
   *
   * @param message - Error message
   * @param options - Additional error details
   */
  constructor(
    message: string,
    options?: {
      code?: string;
      statusCode?: number;
      originalError?: unknown;
    }
  ) {
    super(message);
    this.name = "UjumbeSmsError";
    this.code = options?.code;
    this.statusCode = options?.statusCode;
    this.originalError = options?.originalError;

    // Ensure proper prototype chain for instanceof checks
    Object.setPrototypeOf(this, UjumbeSmsError.prototype);
  }
}

/**
 * Creates a network error instance
 *
 * @param error - Original error that occurred
 * @returns UjumbeSmsError instance
 */
export function createNetworkError(error: unknown): UjumbeSmsError {
  const message =
    error instanceof Error ? error.message : "Network request failed";
  return new UjumbeSmsError(`Network error: ${message}`, {
    originalError: error,
  });
}

/**
 * Creates an API error instance
 *
 * @param statusCode - HTTP status code
 * @param code - API error code if available
 * @param message - Error message
 * @returns UjumbeSmsError instance
 */
export function createApiError(
  statusCode: number,
  code: string | undefined,
  message: string
): UjumbeSmsError {
  return new UjumbeSmsError(message, {
    statusCode,
    code,
  });
}

/**
 * Creates a validation error instance
 *
 * @param message - Error message
 * @returns UjumbeSmsError instance
 */
export function createValidationError(message: string): UjumbeSmsError {
  return new UjumbeSmsError(`Validation error: ${message}`);
}
