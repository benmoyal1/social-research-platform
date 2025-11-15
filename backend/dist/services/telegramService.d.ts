import QueryStream from 'pg-query-stream';
import { TelegramMessage, TelegramFilters, PaginationResult } from '../types/index.js';
/**
 * Service layer for Telegram data operations
 * Handles all business logic and database queries for Telegram messages
 */
/**
 * Get paginated Telegram messages with optional filters
 */
export declare function getPaginatedTelegramMessages(page?: number, limit?: number, filters?: TelegramFilters): Promise<PaginationResult<TelegramMessage>>;
/**
 * Stream all Telegram messages as CSV
 */
export declare function streamAllTelegramMessages(): Promise<QueryStream>;
/**
 * Stream filtered Telegram messages as CSV
 */
export declare function streamFilteredTelegramMessages(filters: TelegramFilters): Promise<QueryStream>;
/**
 * Get available channels
 */
export declare function getTelegramChannels(): Promise<string[]>;
/**
 * Get statistics
 */
export declare function getTelegramStats(): Promise<any>;
//# sourceMappingURL=telegramService.d.ts.map