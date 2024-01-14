import { type NextFunction, type Request, type Response } from 'express';

import { ApiError } from '../../exeptions/api.error';
import { JWTService } from '../../application/jwt.service';

export const refreshTokenMiddleware = (request: Request, response: Response, next: NextFunction): void => {
  const refreshToken: string = request.cookies.refreshToken;

  if (!refreshToken) {
    next(ApiError.UnauthorizedError());
    return;
  }

  try {
    const jwtPayload = JWTService.validateToken(refreshToken);

    if (!jwtPayload || typeof jwtPayload === 'string' || !jwtPayload.userId) {
      next(ApiError.UnauthorizedError());

      return;
    }

    request.userId = jwtPayload.userId;

    next();
  } catch (error) {
    next(ApiError.UnauthorizedError());
  }
};
