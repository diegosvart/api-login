import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './routes/auth';
import { config } from 'dotenv';

// Load environment variables
config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Debug middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  next();
});

// Routes
app.use('/api/auth', authRoutes);

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'API Login',
    version: '1.0.0',
  });
});

// Basic route
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    message: 'Welcome to API Login',
    documentation: '/docs',
    health: '/health',
  });
});

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);

  // Default error
  let status = 500;
  let message = 'Internal server error';

  // Handle specific errors
  if (err.message === 'User already exists with this email') {
    status = 409; // Conflict
    message = err.message;
  } else if (err.message === 'Invalid credentials') {
    status = 401; // Unauthorized
    message = err.message;
  } else if (err.message === 'User not found' || err.message === 'Current password is incorrect') {
    status = 404; // Not Found
    message = err.message;
  } else if (err.message === 'Invalid or expired token') {
    status = 401; // Unauthorized
    message = err.message;
  }

  res.status(status).json({
    success: false,
    message: message,
    ...(process.env.NODE_ENV === 'development' && { error: err.message, stack: err.stack }),
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Login API Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});

export default app;
