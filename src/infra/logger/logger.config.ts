import { randomUUID } from 'node:crypto';
import pino from 'pino';

export const pinoHttp: pino.LoggerOptions = {
  level: process.env.LOG_LEVEL || 'info',
  messageKey: 'message',

  formatters: {
    bindings: () => ({}),

    level: (label) => ({
      level: label,
    }),
  },

  timestamp: pino.stdTimeFunctions.isoTime,

  serializers: {
    req: (req: Record<string, unknown>) => ({
      id:
        req.headers['x-amzn-requestid'] ??
        req.headers['request-id'] ??
        randomUUID(),
      query: req.query,
      url: req.url,
      method: req.method,
      headers: Object.keys(req.headers).reduce(
        (acc, cur) => ({
          ...acc,
          [cur]: req.headers[cur],
        }),
        {},
      ),
    }),
  },

  redact: {
    paths: [
      'req.headers["authorization"]',
      'req.headers["idtoken"]',
      'req.headers["cookie"]',
      'req.headers["accessToken"]',
    ],
  },
};
