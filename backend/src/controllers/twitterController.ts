import { Response } from 'express';
import * as twitterService from '../services/twitterService.js';
import { AuthRequest, TwitterPost } from '../types/index.js';

/**
 * Controller for Twitter endpoints
 * Handles HTTP requests and responses
 */

/**
 * POST /api/paginate/twitter
 * Get paginated Twitter posts with optional filters
 */
export async function getPaginatedPosts(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { page = 1, limit = 50, ...filters } = req.body;

    const result = await twitterService.getPaginatedTwitterPosts(
      parseInt(page as string),
      parseInt(limit as string),
      filters
    );

    res.json(result);
  } catch (error: any) {
    console.error('Error getting paginated Twitter posts:', error);
    res.status(500).json({ error: error.message });
  }
}

/**
 * GET /api/export/twitter/all
 * Stream all Twitter posts as CSV
 */
export async function exportAllPosts(_req: AuthRequest, res: Response): Promise<void> {
  try {
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="twitter_export.csv"');
    res.write('\ufeff'); // UTF-8 BOM

    // Write CSV header
    res.write('date_posted,user_posted,description,tagged_users,hashtags,replies,reposts,likes,views\n');

    const stream = await twitterService.streamAllTwitterPosts();

    stream.on('data', (row: TwitterPost) => {
      const csvRow = [
        row.date_posted ? new Date(row.date_posted).toISOString().split('T')[0] : '',
        row.user_posted || '',
        row.description ? `"${row.description.replace(/"/g, '""')}"` : '',
        (row as any).tagged_users || '',
        row.hashtags || '',
        row.replies || '',
        row.reposts || '',
        row.likes || '',
        row.views || ''
      ].join(',');
      res.write(csvRow + '\n');
    });

    stream.on('end', () => {
      res.end();
    });

    stream.on('error', (error: Error) => {
      console.error('Stream error:', error);
      if (!res.headersSent) {
        res.status(500).json({ error: error.message });
      }
    });
  } catch (error: any) {
    console.error('Error exporting all Twitter posts:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: error.message });
    }
  }
}

/**
 * POST /api/export/twitter/filtered
 * Stream filtered Twitter posts as CSV
 */
export async function exportFilteredPosts(req: AuthRequest, res: Response): Promise<void> {
  try {
    const filters = req.body;

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="twitter_filtered.csv"');
    res.write('\ufeff'); // UTF-8 BOM

    // Write CSV header
    res.write('date_posted,user_posted,description,tagged_users,hashtags,replies,reposts,likes,views\n');

    const stream = await twitterService.streamFilteredTwitterPosts(filters);

    stream.on('data', (row: TwitterPost) => {
      const csvRow = [
        row.date_posted ? new Date(row.date_posted).toISOString().split('T')[0] : '',
        row.user_posted || '',
        row.description ? `"${row.description.replace(/"/g, '""')}"` : '',
        (row as any).tagged_users || '',
        row.hashtags || '',
        row.replies || '',
        row.reposts || '',
        row.likes || '',
        row.views || ''
      ].join(',');
      res.write(csvRow + '\n');
    });

    stream.on('end', () => {
      res.end();
    });

    stream.on('error', (error: Error) => {
      console.error('Stream error:', error);
      if (!res.headersSent) {
        res.status(500).json({ error: error.message });
      }
    });
  } catch (error: any) {
    console.error('Error exporting filtered Twitter posts:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: error.message });
    }
  }
}

/**
 * GET /api/metadata/twitter/users
 * Get available Twitter users
 */
export async function getUsers(_req: AuthRequest, res: Response): Promise<void> {
  try {
    const users = await twitterService.getTwitterUsers();
    res.json({ users });
  } catch (error: any) {
    console.error('Error getting Twitter users:', error);
    res.status(500).json({ error: error.message });
  }
}

/**
 * GET /api/stats/twitter
 * Get Twitter statistics
 */
export async function getStats(_req: AuthRequest, res: Response): Promise<void> {
  try {
    const stats = await twitterService.getTwitterStats();
    res.json(stats);
  } catch (error: any) {
    console.error('Error getting Twitter stats:', error);
    res.status(500).json({ error: error.message });
  }
}
