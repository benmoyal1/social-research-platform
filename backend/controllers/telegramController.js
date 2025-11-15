import * as telegramService from '../services/telegramService.js';

/**
 * Controller for Telegram endpoints
 * Handles HTTP requests and responses
 */

/**
 * GET /api/paginate/telegram
 * Get paginated Telegram messages with optional filters
 */
export async function getPaginatedMessages(req, res) {
  try {
    const { page = 1, limit = 50, ...filters } = req.body;

    const result = await telegramService.getPaginatedTelegramMessages(
      parseInt(page),
      parseInt(limit),
      filters
    );

    res.json(result);
  } catch (error) {
    console.error('Error getting paginated Telegram messages:', error);
    res.status(500).json({ error: error.message });
  }
}

/**
 * GET /api/export/telegram/all
 * Stream all Telegram messages as CSV
 */
export async function exportAllMessages(req, res) {
  try {
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="telegram_export.csv"');
    res.write('\ufeff'); // UTF-8 BOM

    // Write CSV header
    res.write('date,time,channel_name,message_link,content,emoji_num,views,actual_emoji_dict,comments_num\n');

    const stream = await telegramService.streamAllTelegramMessages();

    stream.on('data', (row) => {
      const csvRow = [
        row.date ? new Date(row.date).toISOString().split('T')[0] : '',
        row.time || '',
        row.channel_name || '',
        row.message_link || '',
        row.content ? `"${row.content.replace(/"/g, '""')}"` : '',
        row.emoji_num || '',
        row.views || '',
        row.actual_emoji_dict || '',
        row.comments_num || ''
      ].join(',');
      res.write(csvRow + '\n');
    });

    stream.on('end', () => {
      res.end();
    });

    stream.on('error', (error) => {
      console.error('Stream error:', error);
      if (!res.headersSent) {
        res.status(500).json({ error: error.message });
      }
    });
  } catch (error) {
    console.error('Error exporting all Telegram messages:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: error.message });
    }
  }
}

/**
 * POST /api/export/telegram/filtered
 * Stream filtered Telegram messages as CSV
 */
export async function exportFilteredMessages(req, res) {
  try {
    const filters = req.body;

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="telegram_filtered.csv"');
    res.write('\ufeff'); // UTF-8 BOM

    // Write CSV header
    res.write('date,time,channel_name,message_link,content,emoji_num,views,actual_emoji_dict,comments_num\n');

    const stream = await telegramService.streamFilteredTelegramMessages(filters);

    stream.on('data', (row) => {
      const csvRow = [
        row.date ? new Date(row.date).toISOString().split('T')[0] : '',
        row.time || '',
        row.channel_name || '',
        row.message_link || '',
        row.content ? `"${row.content.replace(/"/g, '""')}"` : '',
        row.emoji_num || '',
        row.views || '',
        row.actual_emoji_dict || '',
        row.comments_num || ''
      ].join(',');
      res.write(csvRow + '\n');
    });

    stream.on('end', () => {
      res.end();
    });

    stream.on('error', (error) => {
      console.error('Stream error:', error);
      if (!res.headersSent) {
        res.status(500).json({ error: error.message });
      }
    });
  } catch (error) {
    console.error('Error exporting filtered Telegram messages:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: error.message });
    }
  }
}

/**
 * GET /api/metadata/telegram/channels
 * Get available Telegram channels
 */
export async function getChannels(req, res) {
  try {
    const channels = await telegramService.getTelegramChannels();
    res.json({ channels });
  } catch (error) {
    console.error('Error getting Telegram channels:', error);
    res.status(500).json({ error: error.message });
  }
}

/**
 * GET /api/stats/telegram
 * Get Telegram statistics
 */
export async function getStats(req, res) {
  try {
    const stats = await telegramService.getTelegramStats();
    res.json(stats);
  } catch (error) {
    console.error('Error getting Telegram stats:', error);
    res.status(500).json({ error: error.message });
  }
}
