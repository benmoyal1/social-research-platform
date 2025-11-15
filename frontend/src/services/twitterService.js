/**
 * Twitter Service - Business logic for Twitter data operations
 */

import { get, post, downloadFile } from './api.js';

/**
 * Fetch paginated Twitter posts
 */
export async function fetchPaginatedPosts(page = 1, limit = 50, filters = {}) {
  return post('/api/paginate/twitter', { page, limit, ...filters });
}

/**
 * Download all Twitter posts as CSV
 */
export async function downloadAllPosts() {
  return downloadFile('/api/export/twitter/all', 'twitter_export.csv');
}

/**
 * Download filtered Twitter posts as CSV
 */
export async function downloadFilteredPosts(filters) {
  return downloadFile('/api/export/twitter/filtered', 'twitter_filtered.csv', 'POST', filters);
}

/**
 * Fetch available users
 */
export async function fetchUsers() {
  const response = await get('/api/metadata/twitter/users');
  return response.users || [];
}

/**
 * Fetch statistics
 */
export async function fetchStats() {
  return get('/api/stats/twitter');
}
