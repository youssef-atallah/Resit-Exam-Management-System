import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { ApiError } from './apiError';
import { ApiResponse, ErrorCodes } from './apiResponse';

/**
 * ============================================================================
 * CENTRALIZED ERROR HANDLER MIDDLEWARE
 * ============================================================================
 * 
 * This middleware catches all errors thrown in route handlers and 
 * sends standardized API responses.
 * 
 * Benefits:
 *   - Consistent error format across all endpoints
 *   - Proper logging of errors
 *   - Hides internal error details in production
 * 
 * Usage in server.ts:
 *   import { errorHandler, notFoundHandler } from './utils/errorHandler';
 *   
 *   // After all routes
 *   app.use(notFoundHandler);
 *   app.use(errorHandler);
 * ============================================================================
 */


/**
 * Log error details (could be extended to use proper logging library)
 */
function logError(err: Error, req: Request): void {
  console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.error(`[ERROR] ${new Date().toISOString()}`);
  console.error(`[PATH]  ${req.method} ${req.path}`);
  console.error(`[MSG]   ${err.message}`);
  if (err instanceof ApiError) {
    console.error(`[CODE]  ${err.code}`);
  }
  if (process.env.NODE_ENV === 'development') {
    console.error(`[STACK] ${err.stack}`);
  }
  console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}


/**
 * Main error handler middleware
 */
export const errorHandler: ErrorRequestHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Log the error
  logError(err, req);

  // Handle our custom ApiError
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
        details: process.env.NODE_ENV === 'development' ? err.details : undefined
      },
      meta: {
        timestamp: Date.now()
      }
    });
    return;
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    res.status(401).json({
      success: false,
      error: {
        code: ErrorCodes.INVALID_TOKEN,
        message: 'Invalid token'
      },
      meta: { timestamp: Date.now() }
    });
    return;
  }

  if (err.name === 'TokenExpiredError') {
    res.status(401).json({
      success: false,
      error: {
        code: ErrorCodes.TOKEN_EXPIRED,
        message: 'Token has expired'
      },
      meta: { timestamp: Date.now() }
    });
    return;
  }

  // Handle unknown errors - don't leak details in production
  res.status(500).json({
    success: false,
    error: {
      code: ErrorCodes.INTERNAL_ERROR,
      message: process.env.NODE_ENV === 'development' 
        ? err.message 
        : 'An unexpected error occurred'
    },
    meta: { timestamp: Date.now() }
  });
};


/**
 * 404 Not Found handler - for routes that don't exist
 */
export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    error: {
      code: ErrorCodes.NOT_FOUND,
      message: `Route ${req.method} ${req.path} not found`
    },
    meta: { timestamp: Date.now() }
  });
};
