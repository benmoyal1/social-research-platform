import { Response } from 'express';
import { AuthRequest } from '../types/index.js';
/**
 * Controller for Twitter endpoints
 * Handles HTTP requests and responses
 */
/**
 * POST /api/paginate/twitter
 * Get paginated Twitter posts with optional filters
 */
export declare function getPaginatedPosts(req: AuthRequest, res: Response): Promise<void>;
/**
 * GET /api/export/twitter/all
 * Stream all Twitter posts as CSV
 */
export declare function exportAllPosts(_req: AuthRequest, res: Response): Promise<void>;
/**
 * POST /api/export/twitter/filtered
 * Stream filtered Twitter posts as CSV
 */
export declare function exportFilteredPosts(req: AuthRequest, res: Response): Promise<void>;
/**
 * GET /api/metadata/twitter/users
 * Get available Twitter users
 */
export declare function getUsers(_req: AuthRequest, res: Response): Promise<void>;
/**
 * GET /api/stats/twitter
 * Get Twitter statistics
 */
export declare function getStats(_req: AuthRequest, res: Response): Promise<void>;
//# sourceMappingURL=twitterController.d.ts.map