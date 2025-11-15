import { Response } from 'express';
import { AuthRequest } from '../types/index.js';
/**
 * Controller for Telegram endpoints
 * Handles HTTP requests and responses
 */
/**
 * POST /api/paginate/telegram
 * Get paginated Telegram messages with optional filters
 */
export declare function getPaginatedMessages(req: AuthRequest, res: Response): Promise<void>;
/**
 * GET /api/export/telegram/all
 * Stream all Telegram messages as CSV
 */
export declare function exportAllMessages(_req: AuthRequest, res: Response): Promise<void>;
/**
 * POST /api/export/telegram/filtered
 * Stream filtered Telegram messages as CSV
 */
export declare function exportFilteredMessages(req: AuthRequest, res: Response): Promise<void>;
/**
 * GET /api/metadata/telegram/channels
 * Get available Telegram channels
 */
export declare function getChannels(_req: AuthRequest, res: Response): Promise<void>;
/**
 * GET /api/stats/telegram
 * Get Telegram statistics
 */
export declare function getStats(_req: AuthRequest, res: Response): Promise<void>;
//# sourceMappingURL=telegramController.d.ts.map