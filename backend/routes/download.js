import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create the router
const router = express.Router();

// API endpoint to send the existing CSV file for download (Telegram)
router.get('/telegram', (req, res) => {
    const filePath = path.join(__dirname, '../data', 'telegram_v1.csv');
  
    res.download(filePath, 'telegram_v1.csv', (err) => {
        if (err) {
            console.error('Error while sending the file:', err);
            res.status(500).send('Could not download the file.');
        }
    });
});

// API endpoint to send the existing CSV file for download (Twitter)
router.get('/twitter', (req, res) => {
    const filePath = path.join(__dirname, '../data', 'twitter_v1.csv');
  
    res.download(filePath, 'twitter_v1.csv', (err) => {
        if (err) {
            console.error('Error while sending the file:', err);
            res.status(500).send('Could not download the file.');
        }
    });
});

export default router;
