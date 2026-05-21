import { logger } from '@config/log';
import { pinoHttp } from 'pino-http';
import { randomUUID } from 'node:crypto';
import { IncomingMessage, ServerResponse } from 'node:http';
const HttpLogger = pinoHttp({
  ...logger,

  genReqId: (req: IncomingMessage) => {
    return req.headers['x-request-id'] || randomUUID();
  },

  customReceivedMessage: (req: IncomingMessage) => {
    return `[ID: ${req.id}] Incoming ${req.method} ${req.url}`;
  },

  customSuccessMessage: (
    req: IncomingMessage,
    res: ServerResponse,
    time: number,
  ) => {
    res.setHeader('X-Request-Id', req.id as string);

    return `[ID: ${req.id}] Success ${req.method} ${req.url} -> HTTP ${res.statusCode} (${time}ms)`;
  },

  customErrorMessage: (
    req: IncomingMessage,
    res: ServerResponse,
    error: Error,
  ) => {
    res.setHeader('X-Request-Id', req.id as string);
    return `[ID: ${req.id}] Failed ${req.method} ${req.url} -> HTTP ${res.statusCode} | ${error.message}`;
  },
});

export default HttpLogger;
