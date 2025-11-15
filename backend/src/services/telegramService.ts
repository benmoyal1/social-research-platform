import QueryStream from 'pg-query-stream';
import { QueryResult } from 'pg';
import pool from '../config/database.js';
import {
  TelegramMessage,
  TelegramFilters,
  PaginationResult,
} from '../types/index.js';

/**
 * Service layer for Telegram data operations
 * Handles all business logic and database queries for Telegram messages
 */

/**
 * Get paginated Telegram messages with optional filters
 */
export async function getPaginatedTelegramMessages(
  page: number = 1,
  limit: number = 50,
  filters: TelegramFilters = {}
): Promise<PaginationResult<TelegramMessage>> {
  const client = await pool.connect();

  try {
    const offset = (page - 1) * limit;
    const conditions: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    // Build WHERE clause based on filters
    if (filters.dateRange?.start) {
      conditions.push(`date >= $${paramCount++}`);
      values.push(filters.dateRange.start);
    }

    if (filters.dateRange?.end) {
      conditions.push(`date <= $${paramCount++}`);
      values.push(filters.dateRange.end);
    }

    if (filters.channels && filters.channels.length > 0) {
      conditions.push(`channel_name = ANY($${paramCount++})`);
      values.push(filters.channels);
    }

    if (filters.searchText) {
      conditions.push(`content ILIKE $${paramCount++}`);
      values.push(`%${filters.searchText}%`);
    }

    if (filters.minViews !== null && filters.minViews !== undefined) {
      conditions.push(`views >= $${paramCount++}`);
      values.push(filters.minViews);
    }

    if (filters.maxViews !== null && filters.maxViews !== undefined) {
      conditions.push(`views <= $${paramCount++}`);
      values.push(filters.maxViews);
    }

    if (filters.minEmojis !== null && filters.minEmojis !== undefined) {
      conditions.push(`emoji_num >= $${paramCount++}`);
      values.push(filters.minEmojis);
    }

    if (filters.maxEmojis !== null && filters.maxEmojis !== undefined) {
      conditions.push(`emoji_num <= $${paramCount++}`);
      values.push(filters.maxEmojis);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Get total count
    const countQuery = `SELECT COUNT(*) FROM telegram_messages ${whereClause}`;
    const countResult: QueryResult = await client.query(countQuery, values);
    const totalRecords = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(totalRecords / limit);

    // Get paginated data
    const dataQuery = `
      SELECT * FROM telegram_messages
      ${whereClause}
      ORDER BY date DESC, time DESC
      LIMIT $${paramCount} OFFSET $${paramCount + 1}
    `;
    const dataResult: QueryResult<TelegramMessage> = await client.query(dataQuery, [...values, limit, offset]);

    return {
      data: dataResult.rows,
      pagination: {
        currentPage: page,
        pageSize: limit,
        totalRecords,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  } finally {
    client.release();
  }
}

/**
 * Stream all Telegram messages as CSV
 */
export async function streamAllTelegramMessages(): Promise<QueryStream> {
  const client = await pool.connect();
  const query = new QueryStream('SELECT * FROM telegram_messages ORDER BY date DESC, time DESC');
  const stream = client.query(query);

  stream.on('end', () => client.release());
  stream.on('error', () => client.release());

  return stream;
}

/**
 * Stream filtered Telegram messages as CSV
 */
export async function streamFilteredTelegramMessages(filters: TelegramFilters): Promise<QueryStream> {
  const client = await pool.connect();
  const conditions: string[] = [];
  const values: any[] = [];
  let paramCount = 1;

  // Build WHERE clause based on filters
  if (filters.dateRange?.start) {
    conditions.push(`date >= $${paramCount++}`);
    values.push(filters.dateRange.start);
  }

  if (filters.dateRange?.end) {
    conditions.push(`date <= $${paramCount++}`);
    values.push(filters.dateRange.end);
  }

  if (filters.channels && filters.channels.length > 0) {
    conditions.push(`channel_name = ANY($${paramCount++})`);
    values.push(filters.channels);
  }

  if (filters.searchText) {
    conditions.push(`content ILIKE $${paramCount++}`);
    values.push(`%${filters.searchText}%`);
  }

  if (filters.minViews !== null && filters.minViews !== undefined) {
    conditions.push(`views >= $${paramCount++}`);
    values.push(filters.minViews);
  }

  if (filters.maxViews !== null && filters.maxViews !== undefined) {
    conditions.push(`views <= $${paramCount++}`);
    values.push(filters.maxViews);
  }

  if (filters.minEmojis !== null && filters.minEmojis !== undefined) {
    conditions.push(`emoji_num >= $${paramCount++}`);
    values.push(filters.minEmojis);
  }

  if (filters.maxEmojis !== null && filters.maxEmojis !== undefined) {
    conditions.push(`emoji_num <= $${paramCount++}`);
    values.push(filters.maxEmojis);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const queryText = `
    SELECT * FROM telegram_messages
    ${whereClause}
    ORDER BY date DESC, time DESC
  `;

  const query = new QueryStream(queryText, values);
  const stream = client.query(query);

  stream.on('end', () => client.release());
  stream.on('error', () => client.release());

  return stream;
}

/**
 * Get available channels
 */
export async function getTelegramChannels(): Promise<string[]> {
  const result: QueryResult = await pool.query('SELECT DISTINCT channel_name FROM telegram_messages ORDER BY channel_name');
  return result.rows.map((row: any) => row.channel_name);
}

/**
 * Get statistics
 */
export async function getTelegramStats(): Promise<any> {
  const result: QueryResult = await pool.query(`
    SELECT
      COUNT(*) as total_messages,
      COUNT(DISTINCT channel_name) as total_channels,
      MAX(date) as latest_date,
      MIN(date) as earliest_date,
      AVG(views)::INTEGER as avg_views,
      MAX(views) as max_views
    FROM telegram_messages
  `);

  return result.rows[0];
}
