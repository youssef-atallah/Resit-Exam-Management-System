import { Router } from 'express';
import { signInHandler, refreshTokenHandler } from '../Auth/authHandler';

const router = Router();

/**
 * ============================================================================
 * AUTHENTICATION ROUTES
 * ============================================================================
 * 
 * These routes handle user authentication and JWT token generation.
 * ============================================================================
 */

// POST /signin - Authenticate user and generate JWT token
  // becarful  Auth/signin - Sign in user
router.post('/signin', signInHandler);

// POST /refresh - Refresh JWT token (extends expiration)
router.post('/refresh', refreshTokenHandler);

export default router;

