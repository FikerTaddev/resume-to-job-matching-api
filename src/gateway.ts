import { Router, Request, Response, NextFunction } from 'express';

export const router = Router();

router.use((req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  next();
});

router.get('/ping', (_req: Request, res: Response) => {
  res.json({ message: 'pong' });
});
