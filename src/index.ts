import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import { config } from './config/config';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';
import { sanitizeInput } from './middleware/validation.middleware';

import productRoutes from './routes/product.routes';
import userRoutes from './routes/user.routes';
import orderRoutes from './routes/order.routes';
import settingsRoutes from './routes/settings.routes';

const app: Express = express();

app.use(helmet());

app.use(cors(config.cors));

app.use(compression());

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(sanitizeInput);

if (config.env === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
    environment: config.env,
  });
});

app.get('/', (_req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'NaturTail Backend API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      products: `${config.apiPrefix}/products`,
      users: `${config.apiPrefix}/users`,
      orders: `${config.apiPrefix}/orders`,
      settings: `${config.apiPrefix}/settings`,
    },
  });
});

app.use(config.apiPrefix, productRoutes);
app.use(config.apiPrefix, userRoutes);
app.use(config.apiPrefix, orderRoutes);
app.use(config.apiPrefix, settingsRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

const server = app.listen(config.port, () => {
  console.log(`
🚀 Server is running!
📡 Environment: ${config.env}
🔗 URL: http://localhost:${config.port}
📍 API Prefix: ${config.apiPrefix}
  `);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

export default app;