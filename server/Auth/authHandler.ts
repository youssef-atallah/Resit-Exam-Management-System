import { Request, Response, NextFunction, RequestHandler } from "express";
import { JWTObject, User } from "../types";
import jsonwebtoken from "jsonwebtoken";
import { db } from "../datastore";

// Sign-in handler for user authentication with role detection
export const signInHandler: RequestHandler = async (req, res) => {
  try {
    const { email, id, password } = req.body;
    
    // User must provide either email or id, plus password
    if ((!email && !id) || !password) {
      res.status(400).json({ error: 'Email or ID and password are required' });
      return;
    }

    // Get user with role from database
    const identifier = email || id;
    const result = await db.getUserWithRole(identifier);
    
    if (!result) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const { user, role } = result;

    // Verify password
    if (user.password !== password) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    // Generate JWT token with role
    const token = signJWT({ id: user.id, role });

    // Return user info and token
    res.status(200).json({
      message: 'Sign in successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role
      }
    });
    
  } catch (error) {
    console.error('Error signing in user:', error);
    res.status(500).json({ error: 'Failed to sign in user' });
  }
};

// Signing the JWT token with role
export function signJWT(object: JWTObject): string {
  const secret = getJWTSecret();
  return jsonwebtoken.sign(
    { id: object.id, role: object.role }, 
    secret, 
    { expiresIn: '7d' }
  );
} 

// Get JWT secret from environment
function getJWTSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error("Missing JWT_SECRET in environment variables");
    process.exit(1);
  }
  return secret;
}

// Verifying the JWT token
export function verifyJWT(token: string): JWTObject {
  const secret = getJWTSecret();
  return jsonwebtoken.verify(token, secret) as JWTObject;
}

// Middleware to authenticate requests
export const authMiddleware: RequestHandler = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'No token provided' });
      return;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    const decoded = verifyJWT(token);
    
    // Attach user ID and role to request object for use in route handlers
    (req as any).userId = decoded.id;
    (req as any).userRole = decoded.role;
    
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// Middleware to require specific roles
export const requireRole = (...allowedRoles: Array<'student' | 'instructor' | 'secretary'>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = (req as any).userRole;
    
    if (!userRole) {
      res.status(401).json({ 
        error: 'Unauthorized - No role in token' 
      });
      return;
    }
    
    if (!allowedRoles.includes(userRole)) {
      res.status(403).json({ 
        error: 'Forbidden - Insufficient permissions',
        required: allowedRoles,
        current: userRole
      });
      return;
    }
    
    next();
  };
};

// Middleware to verify user can only access their own resource
export const requireOwnResource = (req: Request, res: Response, next: NextFunction) => {
  const userId = (req as any).userId;
  const resourceId = req.params.id;
  
  if (!userId) {
    res.status(401).json({
      error: 'Unauthorized - No user ID in token'
    });
    return;
  }
  
  if (userId !== resourceId) {
    res.status(403).json({
      error: 'Forbidden - You can only access your own resources'
    });
    return;
  }
  
  next();
};

// Middleware to verify instructor has access to student (student is in instructor's courses)
export const requireInstructorAccess = async (req: Request, res: Response, next: NextFunction) => {
  const instructorId = (req as any).userId;
  const studentId = req.params.id || req.params.studentId;
  
  if (!instructorId || !studentId) {
    res.status(400).json({
      error: 'Bad request - Missing required parameters'
    });
    return;
  }
  
  try {
    // Get instructor's courses
    const instructorCourses = await db.getInsturctorCourses(instructorId);
    
    // Get student's courses
    const studentCourses = await db.getStudentCourses(studentId);
    
    if (!instructorCourses || !studentCourses) {
      res.status(404).json({
        error: 'Instructor or student not found'
      });
      return;
    }
    
    // Check if there's any overlap
    const hasAccess = instructorCourses.some(course => 
      studentCourses.includes(course)
    );
    
    if (!hasAccess) {
      res.status(403).json({
        error: 'Forbidden - Student is not enrolled in any of your courses'
      });
      return;
    }
    
    next();
  } catch (error) {
    console.error('Error checking instructor access:', error);
    res.status(500).json({ 
      error: 'Authorization check failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
    return;
  }
};

// Combined middleware: Allow if user owns resource OR has required role
export const requireOwnerOrRole = (...allowedRoles: Array<'student' | 'instructor' | 'secretary'>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).userId;
    const userRole = (req as any).userRole;
    const resourceId = req.params.id || req.params.studentId;
    
    if (!userId || !userRole) {
      res.status(401).json({
        error: 'Unauthorized - Missing authentication data'
      });
      return;
    }
    
    // Allow if user owns the resource
    if (userId === resourceId) {
      next();
      return;
    }
    
    // Allow if user has required role
    if (allowedRoles.includes(userRole)) {
      // If instructor, verify they have access to the student
      if (userRole === 'instructor' && resourceId) {
        requireInstructorAccess(req, res, next);
        return;
      }
      next();
      return;
    }
    
    res.status(403).json({
      error: 'Forbidden - Insufficient permissions',
      required: allowedRoles,
      current: userRole
    });
    return;
  };
};

// Refresh token endpoint - generates new token if current one is still valid
export const refreshTokenHandler: RequestHandler = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      res.status(401).json({ error: 'No token provided' });
      return;
    }

    const token = authHeader.substring(7);
    const decoded = verifyJWT(token); // Will throw if expired
    
    // Generate new token with fresh expiration
    const newToken = signJWT({ id: decoded.id, role: decoded.role });
    
    res.status(200).json({
      message: 'Token refreshed',
      token: newToken
    });
  } catch (error) {
    res.status(401).json({ error: 'Token expired or invalid - please log in again' });
  }
};