import { Router } from 'express';
import { signInHandler } from '../Auth/authHandler';

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

export default router;
