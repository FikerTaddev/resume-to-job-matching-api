import pino from 'pino';
import fs from 'node:fs';
import path from 'node:path';

const isProduction = process.env.NODE_ENV === 'production';
const backupLogPath = './logs/api.log';

// 1. Only create directories if we actually need them (or keep it safe)
const dir = path.dirname(backupLogPath);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

// 2. Base configuration options
const pinoOptions = {
  level: isProduction ? 'info' : 'debug',
  redact: {
    paths: [
      'req.headers.authorization',
      'req.headers.cookie',
      'body.password',
      'body.token',
    ],
    censor: '[REDACTED]',
  },
};

let logger : any;

if (!isProduction) {
  // Development Mode: Use pretty printing directly to stdout
  logger = pino({
    ...pinoOptions,
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:yyyy-mm-dd HH:MM:ss.l',
        ignore: 'pid,hostname',
      },
    },
  });
} else {
  // Production Mode: Use multiple streams safely without conflicting transport threads
  const streams = [
    { stream: process.stdout },
    {
      stream: pino.destination({
        dest: backupLogPath,
        sync: false,
        minLength: 4096,
      }),
    },
  ];

  logger = pino(pinoOptions, pino.multistream(streams));
}

export { logger };