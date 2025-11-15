import QueryStream from 'pg-query-stream';
import pool from '../config/database.js';
/**
 * Service layer for Twitter data operations
 * Handles all business logic and database queries for Twitter posts
 */
/**
 * Get paginated Twitter posts with optional filters
 */
export async function getPaginatedTwitterPosts(page = 1, limit = 50, filters = {}) {
    const client = await pool.connect();
    try {
        const offset = (page - 1) * limit;
        const conditions = [];
        const values = [];
        let paramCount = 1;
        // Build WHERE clause based on filters
        if (filters.dateStart) {
            conditions.push(`date_posted >= $${paramCount++}`);
            values.push(filters.dateStart);
        }
        if (filters.dateEnd) {
            conditions.push(`date_posted <= $${paramCount++}`);
            values.push(filters.dateEnd);
        }
        if (filters.users && filters.users.length > 0) {
            conditions.push(`user_posted = ANY($${paramCount++})`);
            values.push(filters.users);
        }
        if (filters.searchTerm) {
            conditions.push(`description ILIKE $${paramCount++}`);
            values.push(`%${filters.searchTerm}%`);
        }
        if (filters.hashtags && filters.hashtags.length > 0) {
            const hashtagConditions = filters.hashtags.map(() => `hashtags ILIKE $${paramCount++}`);
            conditions.push(`(${hashtagConditions.join(' OR ')})`);
            filters.hashtags.forEach(tag => values.push(`%${tag}%`));
        }
        if (filters.minReplies !== null && filters.minReplies !== undefined) {
            conditions.push(`replies >= $${paramCount++}`);
            values.push(filters.minReplies);
        }
        if (filters.maxReplies !== null && filters.maxReplies !== undefined) {
            conditions.push(`replies <= $${paramCount++}`);
            values.push(filters.maxReplies);
        }
        if (filters.minReposts !== null && filters.minReposts !== undefined) {
            conditions.push(`reposts >= $${paramCount++}`);
            values.push(filters.minReposts);
        }
        if (filters.maxReposts !== null && filters.maxReposts !== undefined) {
            conditions.push(`reposts <= $${paramCount++}`);
            values.push(filters.maxReposts);
        }
        if (filters.minLikes !== null && filters.minLikes !== undefined) {
            conditions.push(`likes >= $${paramCount++}`);
            values.push(filters.minLikes);
        }
        if (filters.maxLikes !== null && filters.maxLikes !== undefined) {
            conditions.push(`likes <= $${paramCount++}`);
            values.push(filters.maxLikes);
        }
        if (filters.minViews !== null && filters.minViews !== undefined) {
            conditions.push(`views >= $${paramCount++}`);
            values.push(filters.minViews);
        }
        if (filters.maxViews !== null && filters.maxViews !== undefined) {
            conditions.push(`views <= $${paramCount++}`);
            values.push(filters.maxViews);
        }
        const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
        // Get total count
        const countQuery = `SELECT COUNT(*) FROM twitter_posts ${whereClause}`;
        const countResult = await client.query(countQuery, values);
        const totalRecords = parseInt(countResult.rows[0].count);
        const totalPages = Math.ceil(totalRecords / limit);
        // Get paginated data
        const dataQuery = `
      SELECT * FROM twitter_posts
      ${whereClause}
      ORDER BY date_posted DESC
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
    }
    finally {
        client.release();
    }
}
/**
 * Stream all Twitter posts as CSV
 */
export async function streamAllTwitterPosts() {
    const client = await pool.connect();
    const query = new QueryStream('SELECT * FROM twitter_posts ORDER BY date_posted DESC');
    const stream = client.query(query);
    stream.on('end', () => client.release());
    stream.on('error', () => client.release());
    return stream;
}
/**
 * Stream filtered Twitter posts as CSV
 */
export async function streamFilteredTwitterPosts(filters) {
    const client = await pool.connect();
    const conditions = [];
    const values = [];
    let paramCount = 1;
    // Build WHERE clause based on filters
    if (filters.dateStart) {
        conditions.push(`date_posted >= $${paramCount++}`);
        values.push(filters.dateStart);
    }
    if (filters.dateEnd) {
        conditions.push(`date_posted <= $${paramCount++}`);
        values.push(filters.dateEnd);
    }
    if (filters.users && filters.users.length > 0) {
        conditions.push(`user_posted = ANY($${paramCount++})`);
        values.push(filters.users);
    }
    if (filters.searchTerm) {
        conditions.push(`description ILIKE $${paramCount++}`);
        values.push(`%${filters.searchTerm}%`);
    }
    if (filters.hashtags && filters.hashtags.length > 0) {
        const hashtagConditions = filters.hashtags.map(() => `hashtags ILIKE $${paramCount++}`);
        conditions.push(`(${hashtagConditions.join(' OR ')})`);
        filters.hashtags.forEach(tag => values.push(`%${tag}%`));
    }
    if (filters.minReplies !== null && filters.minReplies !== undefined) {
        conditions.push(`replies >= $${paramCount++}`);
        values.push(filters.minReplies);
    }
    if (filters.maxReplies !== null && filters.maxReplies !== undefined) {
        conditions.push(`replies <= $${paramCount++}`);
        values.push(filters.maxReplies);
    }
    if (filters.minReposts !== null && filters.minReposts !== undefined) {
        conditions.push(`reposts >= $${paramCount++}`);
        values.push(filters.minReposts);
    }
    if (filters.maxReposts !== null && filters.maxReposts !== undefined) {
        conditions.push(`reposts <= $${paramCount++}`);
        values.push(filters.maxReposts);
    }
    if (filters.minLikes !== null && filters.minLikes !== undefined) {
        conditions.push(`likes >= $${paramCount++}`);
        values.push(filters.minLikes);
    }
    if (filters.maxLikes !== null && filters.maxLikes !== undefined) {
        conditions.push(`likes <= $${paramCount++}`);
        values.push(filters.maxLikes);
    }
    if (filters.minViews !== null && filters.minViews !== undefined) {
        conditions.push(`views >= $${paramCount++}`);
        values.push(filters.minViews);
    }
    if (filters.maxViews !== null && filters.maxViews !== undefined) {
        conditions.push(`views <= $${paramCount++}`);
        values.push(filters.maxViews);
    }
    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const queryText = `
    SELECT * FROM twitter_posts
    ${whereClause}
    ORDER BY date_posted DESC
  `;
    const query = new QueryStream(queryText, values);
    const stream = client.query(query);
    stream.on('end', () => client.release());
    stream.on('error', () => client.release());
    return stream;
}
/**
 * Get available users
 */
export async function getTwitterUsers() {
    const result = await pool.query('SELECT DISTINCT user_posted FROM twitter_posts ORDER BY user_posted');
    return result.rows.map((row) => row.user_posted);
}
/**
 * Get statistics
 */
export async function getTwitterStats() {
    const result = await pool.query(`
    SELECT
      COUNT(*) as total_posts,
      COUNT(DISTINCT user_posted) as total_users,
      MAX(date_posted) as latest_date,
      MIN(date_posted) as earliest_date,
      AVG(likes)::INTEGER as avg_likes,
      MAX(likes) as max_likes,
      AVG(views)::INTEGER as avg_views,
      MAX(views) as max_views
    FROM twitter_posts
  `);
    return result.rows[0];
}
//# sourceMappingURL=twitterService.js.map