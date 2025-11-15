import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import path from 'path';
import downloadRouter from './routes/download.js';
import signedUrlRouter from './routes/signedUrl.js';
import loginRouter from './routes/loginRouter.js';
import dataExportRouter from './routes/dataExport.js';
import dataPaginationRouter from './routes/dataPagination.js';
import { authenticateToken, checkTokenExpiration } from './middleware/auth.js';

const app = express();
const port = 5000;

// Get __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Enable CORS to allow communication between frontend and backend
app.use(cors());
app.use(express.json());

// Define a default route
app.get('/', (req, res) => {
  res.status(200).json({
      status: 'OK',
      message: 'Request was successful',
  });
});

// Public routes (no authentication required)
app.use('/login', loginRouter);

// Protected routes (authentication required)
app.use('/download', authenticateToken, checkTokenExpiration, downloadRouter);
app.use('/signedUrl', authenticateToken, checkTokenExpiration, signedUrlRouter);
app.use('/api', authenticateToken, checkTokenExpiration, dataExportRouter);
app.use('/api', authenticateToken, checkTokenExpiration, dataPaginationRouter);
// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
