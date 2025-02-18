import {Request, Response, NextFunction} from 'express';
import {HttpResponse} from './http-response';

export type MiddlewareFunction = (
  req: Request,
  res: Response,
  next: NextFunction,
) => void;
export type ControllerFunction = (
  req: Request,
  res: Response,
  next: NextFunction,
  ...args: unknown[]
) => Promise<HttpResponse<unknown>>;
