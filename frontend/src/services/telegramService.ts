/**
 * Telegram Service - Business logic for Telegram data operations
 */

import { get, post, downloadFile } from './api';
import {
  PaginatedResponse,
  TelegramMessage,
  TelegramFilters,
  TelegramStats,
  ChannelsMetadata,
} from '../types';

/**
 * Fetch paginated Telegram messages
 */
export async function fetchPaginatedMessages(
  page: number = 1,
  limit: number = 50,
  filters: TelegramFilters = {}
): Promise<PaginatedResponse<TelegramMessage>> {
  return post<PaginatedResponse<TelegramMessage>>('/api/paginate/telegram', { page, limit, ...filters });
}

/**
 * Download all Telegram messages as CSV
 */
export async function downloadAllMessages(): Promise<void> {
  return downloadFile('/api/export/telegram/all', 'telegram_export.csv');
}

/**
 * Download filtered Telegram messages as CSV
 */
export async function downloadFilteredMessages(filters: TelegramFilters): Promise<void> {
  return downloadFile('/api/export/telegram/filtered', 'telegram_filtered.csv', 'POST', filters);
}

/**
 * Fetch available channels
 */
export async function fetchChannels(): Promise<string[]> {
  const response = await get<ChannelsMetadata>('/api/metadata/telegram/channels');
  return response.channels || [];
}

/**
 * Fetch statistics
 */
export async function fetchStats(): Promise<TelegramStats> {
  return get<TelegramStats>('/api/stats/telegram');
}
