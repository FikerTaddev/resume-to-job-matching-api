import { logger } from '@config/log';
import { pinoHttp } from 'pino-http';
import { randomUUID } from 'node:crypto';
import { IncomingMessage, ServerResponse } from 'node:http';

export const HttpLogger = pinoHttp({
  ...logger,

  genReqId: (req: IncomingMessage, res?: ServerResponse) => {
    const id = (req.headers['x-request-id'] as string) || randomUUID();

    if (res && !res.headersSent) {
      res.setHeader('X-Request-Id', id);
    }

    return id;
  },

  customReceivedMessage: (req: IncomingMessage) => {
    return `[ID: ${req.id}] Incoming ${req.method} ${req.url}`;
  },

  customSuccessMessage: (
    req: IncomingMessage,
    res: ServerResponse,
    time: number,
  ) => {
    return `[ID: ${req.id}] Success ${req.method} ${req.url} -> HTTP ${res.statusCode} (${time}ms)`;
  },

  customErrorMessage: (
    req: IncomingMessage,
    res: ServerResponse,
    error: Error,
  ) => {
    return `[ID: ${req.id}] Failed ${req.method} ${req.url} -> HTTP ${res.statusCode} | ${error.message}`;
  },
});
