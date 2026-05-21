import { Application } from 'express';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { HttpLogger } from './middleware/logger.js';

const app: Application = express();

app.use(express.json());
app.use(helmet());
app.use(HttpLogger);
app.use(
  cors({
    origin: 'frontend-url.org',
  }),
);
export default app;
