import express, { Request, Response } from 'express';
import cors from 'cors';
// import downloadRouter from './routes/download.js';
// import signedUrlRouter from './routes/signedUrl.js';
import loginRouter from './routes/loginRouter.js';
import dataExportRouter from './routes/dataExport.js';
import dataPaginationRouter from './routes/dataPagination.js';
import { authenticateToken, checkTokenExpiration } from './middleware/auth.js';

const app = express();
const port = 5000;

// Enable CORS to allow communication between frontend and backend
app.use(cors());
app.use(express.json());

// Define a default route
app.get('/', (_req: Request, res: Response): void => {
  res.status(200).json({
      status: 'OK',
      message: 'Request was successful',
  });
});

// Public routes (no authentication required)
app.use('/login', loginRouter);

// Protected routes (authentication required)
// Note: Uncomment these lines once download.ts and signedUrl.ts are converted to TypeScript
// app.use('/download', authenticateToken, checkTokenExpiration, downloadRouter);
// app.use('/signedUrl', authenticateToken, checkTokenExpiration, signedUrlRouter);
app.use('/api', authenticateToken, checkTokenExpiration, dataExportRouter);
app.use('/api', authenticateToken, checkTokenExpiration, dataPaginationRouter);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;
