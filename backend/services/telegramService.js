import QueryStream from 'pg-query-stream';
import pool from '../config/database.js';

/**
 * Service layer for Telegram data operations
 * Handles all business logic and database queries for Telegram messages
 */

/**
 * Get paginated Telegram messages with optional filters
 */
export async function getPaginatedTelegramMessages(page = 1, limit = 50, filters = {}) {
  const client = await pool.connect();

  try {
    const offset = (page - 1) * limit;
    const conditions = [];
    const values = [];
    let paramCount = 1;

    // Build WHERE clause based on filters
    if (filters.dateStart) {
      conditions.push(`date >= $${paramCount++}`);
      values.push(filters.dateStart);
    }

    if (filters.dateEnd) {
      conditions.push(`date <= $${paramCount++}`);
      values.push(filters.dateEnd);
    }

    if (filters.channels && filters.channels.length > 0) {
      conditions.push(`channel_name = ANY($${paramCount++})`);
      values.push(filters.channels);
    }

    if (filters.searchTerm) {
      conditions.push(`content ILIKE $${paramCount++}`);
      values.push(`%${filters.searchTerm}%`);
    }

    if (filters.minViews !== null && filters.minViews !== undefined) {
      conditions.push(`views >= $${paramCount++}`);
      values.push(filters.minViews);
    }

    if (filters.maxViews !== null && filters.maxViews !== undefined) {
      conditions.push(`views <= $${paramCount++}`);
      values.push(filters.maxViews);
    }

    if (filters.minComments !== null && filters.minComments !== undefined) {
      conditions.push(`comments_num >= $${paramCount++}`);
      values.push(filters.minComments);
    }

    if (filters.maxComments !== null && filters.maxComments !== undefined) {
      conditions.push(`comments_num <= $${paramCount++}`);
      values.push(filters.maxComments);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Get total count
    const countQuery = `SELECT COUNT(*) FROM telegram_messages ${whereClause}`;
    const countResult = await client.query(countQuery, values);
    const totalRecords = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(totalRecords / limit);

    // Get paginated data
    const dataQuery = `
      SELECT * FROM telegram_messages
      ${whereClause}
      ORDER BY date DESC, time DESC
      LIMIT $${paramCount} OFFSET $${paramCount + 1}
    `;
    const dataResult = await client.query(dataQuery, [...values, limit, offset]);

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
export async function streamAllTelegramMessages() {
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
export async function streamFilteredTelegramMessages(filters) {
  const client = await pool.connect();
  const conditions = [];
  const values = [];
  let paramCount = 1;

  // Build WHERE clause based on filters
  if (filters.dateStart) {
    conditions.push(`date >= $${paramCount++}`);
    values.push(filters.dateStart);
  }

  if (filters.dateEnd) {
    conditions.push(`date <= $${paramCount++}`);
    values.push(filters.dateEnd);
  }

  if (filters.channels && filters.channels.length > 0) {
    conditions.push(`channel_name = ANY($${paramCount++})`);
    values.push(filters.channels);
  }

  if (filters.searchTerm) {
    conditions.push(`content ILIKE $${paramCount++}`);
    values.push(`%${filters.searchTerm}%`);
  }

  if (filters.minViews !== null && filters.minViews !== undefined) {
    conditions.push(`views >= $${paramCount++}`);
    values.push(filters.minViews);
  }

  if (filters.maxViews !== null && filters.maxViews !== undefined) {
    conditions.push(`views <= $${paramCount++}`);
    values.push(filters.maxViews);
  }

  if (filters.minComments !== null && filters.minComments !== undefined) {
    conditions.push(`comments_num >= $${paramCount++}`);
    values.push(filters.minComments);
  }

  if (filters.maxComments !== null && filters.maxComments !== undefined) {
    conditions.push(`comments_num <= $${paramCount++}`);
    values.push(filters.maxComments);
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
export async function getTelegramChannels() {
  const result = await pool.query('SELECT DISTINCT channel_name FROM telegram_messages ORDER BY channel_name');
  return result.rows.map(row => row.channel_name);
}

/**
 * Get statistics
 */
export async function getTelegramStats() {
  const result = await pool.query(`
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
