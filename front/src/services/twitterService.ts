/**
 * Twitter Service - Business logic for Twitter data operations
 */

import { get, post, downloadFile } from './api';
import {
  PaginatedResponse,
  TwitterPost,
  TwitterFilters,
  TwitterStats,
  UsersMetadata,
} from '../types';

/**
 * Fetch paginated Twitter posts
 */
export async function fetchPaginatedPosts(
  page: number = 1,
  limit: number = 50,
  filters: TwitterFilters = {}
): Promise<PaginatedResponse<TwitterPost>> {
  return post<PaginatedResponse<TwitterPost>>('/api/paginate/twitter', { page, limit, ...filters });
}

/**
 * Download all Twitter posts as CSV
 */
export async function downloadAllPosts(): Promise<void> {
  return downloadFile('/api/export/twitter/all', 'twitter_export.csv');
}

/**
 * Download filtered Twitter posts as CSV
 */
export async function downloadFilteredPosts(filters: TwitterFilters): Promise<void> {
  return downloadFile('/api/export/twitter/filtered', 'twitter_filtered.csv', 'POST', filters);
}

/**
 * Fetch available users
 */
export async function fetchUsers(): Promise<string[]> {
  const response = await get<UsersMetadata>('/api/metadata/twitter/users');
  return response.users || [];
}

/**
 * Fetch statistics
 */
export async function fetchStats(): Promise<TwitterStats> {
  return get<TwitterStats>('/api/stats/twitter');
}
