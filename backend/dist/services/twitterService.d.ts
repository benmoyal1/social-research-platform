import QueryStream from 'pg-query-stream';
import { TwitterPost, TwitterFilters, PaginationResult } from '../types/index.js';
/**
 * Service layer for Twitter data operations
 * Handles all business logic and database queries for Twitter posts
 */
/**
 * Get paginated Twitter posts with optional filters
 */
export declare function getPaginatedTwitterPosts(page?: number, limit?: number, filters?: TwitterFilters): Promise<PaginationResult<TwitterPost>>;
/**
 * Stream all Twitter posts as CSV
 */
export declare function streamAllTwitterPosts(): Promise<QueryStream>;
/**
 * Stream filtered Twitter posts as CSV
 */
export declare function streamFilteredTwitterPosts(filters: TwitterFilters): Promise<QueryStream>;
/**
 * Get available users
 */
export declare function getTwitterUsers(): Promise<string[]>;
/**
 * Get statistics
 */
export declare function getTwitterStats(): Promise<any>;
//# sourceMappingURL=twitterService.d.ts.map