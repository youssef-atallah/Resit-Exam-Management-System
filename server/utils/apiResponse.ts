import { Response } from 'express';

/**
 * ============================================================================
 * API RESPONSE UTILITIES
 * ============================================================================
 * 
 * Standardized response format for all API endpoints.
 * 
 * Benefits:
 *   - Consistent structure for frontend parsing
 *   - Type-safe response building
 *   - Automatic timestamp and metadata
 * 
 * Usage:
 *   import { ApiResponse } from '../utils/apiResponse';
 *   
 *   // Success
 *   ApiResponse.success(res, { user: data });
 *   ApiResponse.created(res, { id: newId });
 *   
 *   // Errors
 *   ApiResponse.badRequest(res, 'Missing email field');
 *   ApiResponse.notFound(res, 'Student not found');
 * ============================================================================
 */


/**
 * Standard API response structure
 */
export interface ApiResponseBody<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    timestamp: number;
    requestId?: string;
  };
}


/**
 * Error codes for consistent error identification
 */
export const ErrorCodes = {
  // Validation errors (400)
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  MISSING_FIELD: 'MISSING_FIELD',
  INVALID_FORMAT: 'INVALID_FORMAT',
  
  // Authentication errors (401)
  UNAUTHORIZED: 'UNAUTHORIZED',
  INVALID_TOKEN: 'INVALID_TOKEN',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  
  // Authorization errors (403)
  FORBIDDEN: 'FORBIDDEN',
  INSUFFICIENT_PERMISSIONS: 'INSUFFICIENT_PERMISSIONS',
  
  // Not found errors (404)
  NOT_FOUND: 'NOT_FOUND',
  RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
  
  // Conflict errors (409)
  CONFLICT: 'CONFLICT',
  ALREADY_EXISTS: 'ALREADY_EXISTS',
  
  // Server errors (500)
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',
} as const;

export type ErrorCode = typeof ErrorCodes[keyof typeof ErrorCodes];


/**
 * API Response helper class
 */
export class ApiResponse {
  
  /**
   * Build response with metadata
   */
  private static build<T>(success: boolean, data?: T, message?: string, error?: ApiResponseBody['error']): ApiResponseBody<T> {
    const response: ApiResponseBody<T> = {
      success,
      meta: {
        timestamp: Date.now()
      }
    };
    
    if (data !== undefined) response.data = data;
    if (message) response.message = message;
    if (error) response.error = error;
    
    return response;
  }
  
  // ===========================================================================
  // SUCCESS RESPONSES
  // ===========================================================================
  
  /**
   * 200 OK - Generic success response
   */
  static success<T>(res: Response, data?: T, message?: string): Response {
    return res.status(200).json(this.build(true, data, message));
  }
  
  /**
   * 201 Created - Resource created successfully
   */
  static created<T>(res: Response, data?: T, message = 'Resource created successfully'): Response {
    return res.status(201).json(this.build(true, data, message));
  }
  
  /**
   * 204 No Content - Success with no body
   */
  static noContent(res: Response): Response {
    return res.status(204).send();
  }
  
  // ===========================================================================
  // CLIENT ERROR RESPONSES (4xx)
  // ===========================================================================
  
  /**
   * 400 Bad Request - Invalid request data
   */
  static badRequest(res: Response, message = 'Bad request', code: ErrorCode = ErrorCodes.VALIDATION_ERROR, details?: any): Response {
    return res.status(400).json(this.build(false, undefined, undefined, { code, message, details }));
  }
  
  /**
   * 401 Unauthorized - Authentication required
   */
  static unauthorized(res: Response, message = 'Authentication required', code: ErrorCode = ErrorCodes.UNAUTHORIZED): Response {
    return res.status(401).json(this.build(false, undefined, undefined, { code, message }));
  }
  
  /**
   * 403 Forbidden - Not allowed
   */
  static forbidden(res: Response, message = 'Access denied', code: ErrorCode = ErrorCodes.FORBIDDEN): Response {
    return res.status(403).json(this.build(false, undefined, undefined, { code, message }));
  }
  
  /**
   * 404 Not Found - Resource doesn't exist
   */
  static notFound(res: Response, message = 'Resource not found', code: ErrorCode = ErrorCodes.NOT_FOUND): Response {
    return res.status(404).json(this.build(false, undefined, undefined, { code, message }));
  }
  
  /**
   * 409 Conflict - Resource already exists
   */
  static conflict(res: Response, message = 'Resource already exists', code: ErrorCode = ErrorCodes.CONFLICT): Response {
    return res.status(409).json(this.build(false, undefined, undefined, { code, message }));
  }
  
  // ===========================================================================
  // SERVER ERROR RESPONSES (5xx)
  // ===========================================================================
  
  /**
   * 500 Internal Server Error
   */
  static serverError(res: Response, message = 'Internal server error', details?: any): Response {
    return res.status(500).json(this.build(false, undefined, undefined, { 
      code: ErrorCodes.INTERNAL_ERROR, 
      message,
      details: process.env.NODE_ENV === 'development' ? details : undefined
    }));
  }
}
