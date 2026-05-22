import { Application } from 'express';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { HttpLogger } from './middleware/logger.js';
import { globalErrorHandler } from '@middleware/err';
import { env } from '@config/env';
import { validate } from './middleware/validate.js';
import { RegisterUserSchema } from './schema/user.schema.js';

const app: Application = express();

app.use(express.json());
app.use(helmet());
app.use(HttpLogger);
app.use(
  cors({
    origin:  '*', // fallback origin allow all | TODO: error in production env
  }),
);

app.post('/api/test-validation', validate(RegisterUserSchema), (_req: any, res: any) => {
  res.status(200).json({ success: true, message: "Valid payload received!" });
});

app.use(globalErrorHandler);
export default app;
