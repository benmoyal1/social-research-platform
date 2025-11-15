// apiRoutes.js

import express from 'express';
import { pool } from '../db/pgDb.js';

const router = express.Router();

// Endpoint to create a table, insert data, and return results
router.post('/create_db', async (req, res) => {
  try {
    // Create a table
    await createTable();

    // Insert data into the table
    await insertData();

    // Fetch data from the table
    const data = await fetchData();

    // Return data in the response
    res.status(200).json(data);
  } catch (err) {
    console.error('Error processing request:', err);
    res.status(500).send('Error processing request');
  }
});

router.post('/fetchData', async (req, res) => {
  try {
    // Fetch data from the table
    const data = await fetchData();

    // Return data in the response
    res.status(200).json(data);
  } catch (err) {
    console.error('Error processing request:', err);
    res.status(500).send('Error processing request');
  }
});

// Function to create a table
const createTable = async () => {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        age INT NOT NULL
      )
    `);
  } finally {
    client.release();
  }
};

// Function to insert data into the table
const insertData = async () => {
  const client = await pool.connect();
  try {
    await client.query(`
      INSERT INTO users (name, age) VALUES 
      ('Alice', 30),
      ('Bob', 25),
      ('Charlie', 35)
    `);
  } finally {
    client.release();
  }
};

// Function to fetch data from the table
const fetchData = async () => {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM users');
    return result.rows;
  } finally {
    client.release();
  }
};

export default router;
