import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'research_user',
  password: process.env.DB_PASSWORD || 'research_pass',
  database: process.env.DB_NAME || 'research_db',
});

async function createSampleTwitterData() {
  const client = await pool.connect();

  try {
    console.log('🔄 Creating sample Twitter data...');

    // Create table
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

    // Insert sample data
    const sampleData = [];
    const users = ['@NewsChannel', '@BreakingNews', '@WorldUpdate', '@DailyReport', '@InfoHub'];
    const hashtags = ['#Israel', '#Gaza', '#News', '#BreakingNews', '#Update'];

    const startDate = new Date('2023-10-07');
    const endDate = new Date('2024-05-07');

    for (let i = 0; i < 100; i++) {
      const randomDate = new Date(startDate.getTime() + Math.random() * (endDate - startDate));
      const user = users[Math.floor(Math.random() * users.length)];
      const taggedUsers = Math.random() > 0.7 ? users[Math.floor(Math.random() * users.length)] : '';
      const postHashtags = Array.from({ length: Math.floor(Math.random() * 3) + 1 },
        () => hashtags[Math.floor(Math.random() * hashtags.length)]).join(' ');

      sampleData.push({
        date_posted: randomDate.toISOString().split('T')[0],
        user_posted: user,
        description: `Sample tweet #${i + 1} about current events and updates`,
        tagged_users: taggedUsers,
        hashtags: postHashtags,
        replies: Math.floor(Math.random() * 1000),
        reposts: Math.floor(Math.random() * 5000),
        likes: Math.floor(Math.random() * 10000),
        views: Math.floor(Math.random() * 100000),
      });
    }

    // Insert in batches
    const batchSize = 50;
    for (let i = 0; i < sampleData.length; i += batchSize) {
      const batch = sampleData.slice(i, i + batchSize);
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

    const result = await client.query('SELECT COUNT(*) as count FROM twitter_posts');
    console.log(`🎉 Created ${result.rows[0].count} sample Twitter posts!`);

  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

createSampleTwitterData();
