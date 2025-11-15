import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import csv from 'csv-parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const { Pool } = pg;

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'research_user',
  password: process.env.DB_PASSWORD || 'research_pass',
  database: process.env.DB_NAME || 'research_db',
});

async function migrateTelegramData() {
  const client = await pool.connect();

  try {
    console.log('🔄 Starting Telegram data migration...');

    // Create table
    console.log('📋 Creating telegram_messages table...');
    await client.query(`
      DROP TABLE IF EXISTS telegram_messages;

      CREATE TABLE telegram_messages (
        id SERIAL PRIMARY KEY,
        date DATE,
        time TIME,
        channel_name VARCHAR(500),
        message_link TEXT,
        content TEXT,
        emoji_num INTEGER,
        views INTEGER,
        actual_emoji_dict TEXT,
        comments_num INTEGER,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE INDEX idx_telegram_date ON telegram_messages(date);
      CREATE INDEX idx_telegram_channel ON telegram_messages(channel_name);
      CREATE INDEX idx_telegram_views ON telegram_messages(views);
      CREATE INDEX idx_telegram_date_channel ON telegram_messages(date, channel_name);
    `);
    console.log('✅ Table created successfully!');

    // Read CSV file
    const csvPath = path.join(__dirname, '../data/telegram_v1.csv');
    console.log(`📂 Reading CSV file from: ${csvPath}`);

    if (!fs.existsSync(csvPath)) {
      throw new Error(`CSV file not found at: ${csvPath}`);
    }

    let batch = [];
    const batchSize = 1000;
    let totalInserted = 0;
    let rowCount = 0;

    const stream = fs.createReadStream(csvPath)
      .pipe(csv());

    for await (const row of stream) {
      rowCount++;

      // Skip header row if it somehow got included
      if (row['date'] === 'date' || row['date'] === '' || !row['date']) {
        continue;
      }

      // Parse the row data
      const data = {
        date: row['date'] || null,
        time: row['time'] || null,
        channel_name: row['channel name'] || null,
        message_link: row['message_link'] || null,
        content: row['content'] || null,
        emoji_num: row['emoji_num'] ? parseInt(row['emoji_num']) : null,
        views: row['views'] ? parseInt(row['views']) : null,
        actual_emoji_dict: row['actual_emoji_dict'] || null,
        comments_num: row['comments_num'] ? parseInt(row['comments_num']) : null,
      };

      batch.push(data);

      if (batch.length >= batchSize) {
        await insertBatch(client, batch);
        totalInserted += batch.length;
        console.log(`✅ Inserted ${totalInserted} rows...`);
        batch = [];
      }
    }

    // Insert remaining batch
    if (batch.length > 0) {
      await insertBatch(client, batch);
      totalInserted += batch.length;
    }

    console.log(`🎉 Migration complete! Total rows inserted: ${totalInserted}`);

    // Show stats
    const result = await client.query('SELECT COUNT(*) as count FROM telegram_messages');
    console.log(`📊 Total rows in database: ${result.rows[0].count}`);

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

async function insertBatch(client, batch) {
  const values = [];
  const placeholders = [];

  batch.forEach((row, index) => {
    const offset = index * 9;
    placeholders.push(
      `($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4}, $${offset + 5}, $${offset + 6}, $${offset + 7}, $${offset + 8}, $${offset + 9})`
    );
    values.push(
      row.date,
      row.time,
      row.channel_name,
      row.message_link,
      row.content,
      row.emoji_num,
      row.views,
      row.actual_emoji_dict,
      row.comments_num
    );
  });

  const query = `
    INSERT INTO telegram_messages
    (date, time, channel_name, message_link, content, emoji_num, views, actual_emoji_dict, comments_num)
    VALUES ${placeholders.join(', ')}
  `;

  await client.query(query, values);
}

migrateTelegramData();
