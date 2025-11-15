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

async function migrateTwitterData() {
  const client = await pool.connect();

  try {
    console.log('🔄 Starting Twitter data migration...');

    // Create table
    console.log('📋 Creating twitter_posts table...');
    await client.query(`
      DROP TABLE IF EXISTS twitter_posts;

      CREATE TABLE twitter_posts (
        id SERIAL PRIMARY KEY,
        date_posted DATE,
        user_posted VARCHAR(500),
        description TEXT,
        tagged_users TEXT,
        hashtags TEXT,
        replies INTEGER,
        reposts INTEGER,
        likes INTEGER,
        views INTEGER,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE INDEX idx_twitter_date ON twitter_posts(date_posted);
      CREATE INDEX idx_twitter_user ON twitter_posts(user_posted);
      CREATE INDEX idx_twitter_likes ON twitter_posts(likes);
      CREATE INDEX idx_twitter_views ON twitter_posts(views);
      CREATE INDEX idx_twitter_date_user ON twitter_posts(date_posted, user_posted);
    `);
    console.log('✅ Table created successfully!');

    // Read CSV file
    const csvPath = path.join(__dirname, '../data/twitter_v1.csv');
    console.log(`📂 Reading CSV file from: ${csvPath}`);

    if (!fs.existsSync(csvPath)) {
      console.warn(`⚠️  CSV file not found at: ${csvPath}`);
      console.log('ℹ️  Skipping Twitter migration (file not available)');
      return;
    }

    let batch = [];
    const batchSize = 1000;
    let totalInserted = 0;
    let rowCount = 0;

    const stream = fs.createReadStream(csvPath)
      .pipe(csv());

    for await (const row of stream) {
      rowCount++;

      // Parse the row data
      const data = {
        date_posted: row['date_posted'] || null,
        user_posted: row['user_posted'] || null,
        description: row['description'] || null,
        tagged_users: row['tagged_users'] || null,
        hashtags: row['hashtags'] || null,
        replies: row['replies'] ? parseInt(row['replies']) : null,
        reposts: row['reposts'] ? parseInt(row['reposts']) : null,
        likes: row['likes'] ? parseInt(row['likes']) : null,
        views: row['views'] ? parseInt(row['views']) : null,
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
    const result = await client.query('SELECT COUNT(*) as count FROM twitter_posts');
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
      row.date_posted,
      row.user_posted,
      row.description,
      row.tagged_users,
      row.hashtags,
      row.replies,
      row.reposts,
      row.likes,
      row.views
    );
  });

  const query = `
    INSERT INTO twitter_posts
    (date_posted, user_posted, description, tagged_users, hashtags, replies, reposts, likes, views)
    VALUES ${placeholders.join(', ')}
  `;

  await client.query(query, values);
}

migrateTwitterData();
