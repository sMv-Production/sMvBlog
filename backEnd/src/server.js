import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';

import connectDB from './configs/db.js';
import { verifyAzureConnection } from './configs/azureStorage.js';
import { errorHandler } from './middlewares/error.js';

import authRoutes from './routes/auth.js';
import postRoutes from './routes/post.js';

dotenv.config();

const app = express();

connectDB();
verifyAzureConnection();

// Server setting
app.set('trust proxy', 1); // Use the number of proxies your server sits behind
app.get('/ping', cors({ origin: '*' }), (req, res) => {
  res.status(200).send('success');
});

app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json({ limit: '2mb' })); // Protect against massive JSON injection payloads
app.use(cookieParser());



app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`${process.env.NODE_ENV} Active and execution stable across port: ${PORT}`));
