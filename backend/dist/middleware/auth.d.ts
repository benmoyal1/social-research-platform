import { Response, NextFunction } from 'express';
import { AuthRequest, JWTPayload } from '../types/index.js';
/**
 * Generate JWT token for authenticated user
 */
export declare function generateToken(username: string): string;
/**
 * Verify JWT token
 */
export declare function verifyToken(token: string): JWTPayload | null;
/**
 * Authentication middleware
 * Protects routes by requiring valid JWT token
 */
export declare function authenticateToken(req: AuthRequest, res: Response, next: NextFunction): void;
/**
 * Optional: Middleware to check if token is about to expire
 * Useful for implementing token refresh
 */
export declare function checkTokenExpiration(req: AuthRequest, res: Response, next: NextFunction): void;
//# sourceMappingURL=auth.d.ts.map