/**
 * Telegram Service - Business logic for Telegram data operations
 */

import { get, post, downloadFile } from './api.js';

/**
 * Fetch paginated Telegram messages
 */
export async function fetchPaginatedMessages(page = 1, limit = 50, filters = {}) {
  return post('/api/paginate/telegram', { page, limit, ...filters });
}

/**
 * Download all Telegram messages as CSV
 */
export async function downloadAllMessages() {
  return downloadFile('/api/export/telegram/all', 'telegram_export.csv');
}

/**
 * Download filtered Telegram messages as CSV
 */
export async function downloadFilteredMessages(filters) {
  return downloadFile('/api/export/telegram/filtered', 'telegram_filtered.csv', 'POST', filters);
}

/**
 * Fetch available channels
 */
export async function fetchChannels() {
  const response = await get('/api/metadata/telegram/channels');
  return response.channels || [];
}

/**
 * Fetch statistics
 */
export async function fetchStats() {
  return get('/api/stats/telegram');
}
