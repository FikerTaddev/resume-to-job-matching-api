// src/middlewares/timeout.ts
import { Request, Response, NextFunction } from 'express';

export function requestTimeout(timeoutMs = 5000) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const controller = new AbortController();
    req.abortSignal = controller.signal;

    const timer = setTimeout(() => {
      controller.abort(new Error('REQUEST_TIMEOUT'));
    }, timeoutMs);

    req.on('close', () => {
      if (!res.writableEnded) {
        console.log('Client disconnected early. Aborting operations...');
        controller.abort(new Error('CLIENT_DISCONNECTED'));
      }
    });

    controller.signal.addEventListener('abort', () => {
      clearTimeout(timer);

      if (res.headersSent) return;

      const reason = controller.signal.reason as Error;
      if (reason?.message === 'REQUEST_TIMEOUT') {
        res.status(503).json({
          error: 'Gateway Timeout',
          message: 'Request took too long to process.',
        });
      }
    });

    const cleanUp = () => clearTimeout(timer);
    res.on('finish', cleanUp);
    res.on('close', cleanUp);

    next();
  };
}
