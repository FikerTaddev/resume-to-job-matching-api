import pino from 'pino';

const isProduction = process.env.NODE_ENV === 'production';
const backupLogPath = './logs/api.log';

export const streams = [
  { stream: process.stdout },

  {
    stream: pino.destination({
      dest: backupLogPath,
      sync: false,
      minLength: 4096,
    }),
  },
];

export const logger = pino(
  {
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

    transport: !isProduction
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:yyyy-mm-dd HH:MM:ss.l',
            ignore: 'pid,hostname',
          },
        }
      : undefined,
  },
  pino.multistream(streams),
);
