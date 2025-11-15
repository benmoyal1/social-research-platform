import express from 'express';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'; // Import necessary modules from AWS SDK v3
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'; // Import getSignedUrl from the presigner module
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create the router
const router = express.Router();
// Initialize S3 client
const s3 = new S3Client({
    region: process.env.AWS_REGION,  // Load AWS region from environment variable
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,  // Load from environment variable
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY // Load from environment variable
    }
});

const bucketName = process.env.AWS_BUCKET_NAME;  // S3 bucket name

// Route to generate signed URL for Telegram CSV
router.get('/telegram', async (req, res) => {
    const fileName = 'telegram_v1.csv';  // Name of the Telegram file in the S3 bucket

    const command = new GetObjectCommand({
        Bucket: bucketName,
        Key: fileName
    });

    try {
        const signedUrl = await getSignedUrl(s3, command, { expiresIn: 60 * 5 }); // URL expires in 5 minutes
        res.status(200).json({ url: signedUrl });
    } catch (error) {
        console.error('Error generating signed URL for Telegram:', error);
        res.status(500).json({ error: 'Could not generate signed URL for Telegram' });
    }
});

// Route to generate signed URL for Twitter CSV
router.get('/twitter', async (req, res) => {
    console.log(process.env.AWS_BUCKET_NAME);
    const fileName = 'twitter_v1.csv';  // Name of the Twitter file in the S3 bucket

    const command = new GetObjectCommand({
        Bucket: bucketName,
        Key: fileName
    });

    try {
        const signedUrl = await getSignedUrl(s3, command, { expiresIn: 60 * 5 }); // URL expires in 5 minutes
        res.status(200).json({ url: signedUrl });
    } catch (error) {
        console.error('Error generating signed URL for Twitter:', error);
        res.status(500).json({ error: 'Could not generate signed URL for Twitter' });
    }
});

export default router;
