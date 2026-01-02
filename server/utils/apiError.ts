import { ErrorCode, ErrorCodes } from './apiResponse';

/**
 * ============================================================================
 * CUSTOM API ERROR CLASS
 * ============================================================================
 * 
 * Throw this error anywhere in your handlers, and the centralized 
 * error handler will catch it and send a proper API response.
 * 
 * Usage:
 *   import { ApiError } from '../utils/apiError';
 *   
 *   // Instead of: res.status(404).json({ error: 'Not found' });
 *   // Do this:    throw ApiError.notFound('Student not found');
 *   
 *   // The error handler will catch it and respond properly
 * ============================================================================
 */


export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly code: ErrorCode;
  public readonly details?: any;
  public readonly isOperational: boolean;

  constructor(
    statusCode: number,
    code: ErrorCode,
    message: string,
    details?: any,
    isOperational = true
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.isOperational = isOperational; // Distinguishes operational vs programming errors
    
    // Maintains proper stack trace
    Error.captureStackTrace(this, this.constructor);
  }

  // ===========================================================================
  // FACTORY METHODS - Convenient error creation
  // ===========================================================================

  /**
   * 400 Bad Request
   */
  static badRequest(message = 'Bad request', details?: any): ApiError {
    return new ApiError(400, ErrorCodes.VALIDATION_ERROR, message, details);
  }

  /**
   * 400 Missing Field
   */
  static missingField(field: string): ApiError {
    return new ApiError(400, ErrorCodes.MISSING_FIELD, `Missing required field: ${field}`, { field });
  }

  /**
   * 401 Unauthorized
   */
  static unauthorized(message = 'Authentication required'): ApiError {
    return new ApiError(401, ErrorCodes.UNAUTHORIZED, message);
  }

  /**
   * 401 Token Expired
   */
  static tokenExpired(): ApiError {
    return new ApiError(401, ErrorCodes.TOKEN_EXPIRED, 'Token has expired, please log in again');
  }

  /**
   * 403 Forbidden
   */
  static forbidden(message = 'Access denied'): ApiError {
    return new ApiError(403, ErrorCodes.FORBIDDEN, message);
  }

  /**
   * 404 Not Found
   */
  static notFound(resource = 'Resource'): ApiError {
    return new ApiError(404, ErrorCodes.NOT_FOUND, `${resource} not found`);
  }

  /**
   * 409 Conflict / Already Exists
   */
  static conflict(message = 'Resource already exists'): ApiError {
    return new ApiError(409, ErrorCodes.CONFLICT, message);
  }

  /**
   * 500 Internal Server Error
   */
  static internal(message = 'Internal server error', details?: any): ApiError {
    return new ApiError(500, ErrorCodes.INTERNAL_ERROR, message, details, false);
  }
}
