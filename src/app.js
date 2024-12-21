import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import meetingRoutes from './routes/meeting.routes.js';
import  errorHandler  from './middleware/error.middleware.js';
import logger from './utils/logger.js';

const app = express();
const port = process.env.PORT || 5000;

// Security middleware
app.use(helmet());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use(limiter);
// Routes
app.use('/meetings', meetingRoutes);
// Error handling
app.use(errorHandler);

app.listen(port, () => {
  logger.info(`Server listening on port ${port}`);
});

export default app;
