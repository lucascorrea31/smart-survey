import {Request, NextFunction, Response} from 'express';
import sanitizeHtml from 'sanitize-html';
import {HttpStatusCode} from 'axios';
import {logger} from '../logger/logger';

const sanitizeString = (data: string) => {
  return sanitizeHtml(data, {
    allowedTags: [],
    allowedAttributes: {},
  });
};

const ignoreKeys = ['password', 'secret', 'token'];

const ignoreKey = (key: string) => {
  return ignoreKeys.some(word =>
    key.toLowerCase().includes(word.toLowerCase()),
  );
};

const sanitizeObject = payload => {
  for (const key in payload) {
    if (typeof payload[key] === 'object') {
      sanitizePayload(payload[key]);
    } else if (typeof payload[key] === 'string') {
      if (!ignoreKey(key)) {
        payload[key] = sanitizeString(payload[key]);
      }
    }
  }
  return payload;
};

const sanitizePayload = payload => {
  if (typeof payload === 'object' && payload !== null) {
    return sanitizeObject(payload);
  } else if (typeof payload === 'string') {
    return sanitizeString(payload);
  }

  return payload;
};

export function sanitizeRequest(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (req.body) {
      req.body = sanitizePayload(req.body);
    }

    if (req.query) {
      req.query = sanitizePayload(req.query);
    }

    next();
  } catch (error) {
    logger.info(
      'Invalid JSON input: Malicious or malformed input detected on body or query params',
      {
        data: {
          request: req,
        },
      },
    );

    return res.status(HttpStatusCode.BadRequest).json({
      message: 'Invalid JSON',
    });
  }
}
