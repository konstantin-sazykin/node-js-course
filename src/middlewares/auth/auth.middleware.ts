import { NextFunction, Request, Response } from 'express';

import { ApiError } from '../../exeptions/api.error';
import { JWTService } from '../../application/jwt.service';

export const authMiddleware = (request: Request, response: Response, next: NextFunction) => {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    next(ApiError.UnauthorizedError());
    return;
  }

  try {
    const [tokenType, token] = authHeader.split(' ');

    if (tokenType !== 'Bearer') {
      next(ApiError.UnauthorizedError());
      return;
    }

    const result = JWTService.validateToken(token);

    if (!result || typeof result === 'string' || !result.userId) {
      return next(ApiError.UnauthorizedError());
    }

    request.userId = result.userId;

    next();
  } catch (error) {
    next(ApiError.UnauthorizedError());
  }
};
