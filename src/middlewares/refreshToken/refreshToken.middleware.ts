import { type NextFunction, type Request, type Response } from 'express';

import { ApiError } from '../../exeptions/api.error';
import { JWTService } from '../../application/jwt.service';
import { SessionQueryRepository } from '../../repositories/session/session.query-repository';

export const refreshTokenMiddleware = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
  const refreshToken: string = request.cookies.refreshToken;

  if (!refreshToken) {
    next(ApiError.UnauthorizedError());
    return;
  }

  try {
    const jwtPayload = JWTService.validateToken(refreshToken);

    if (!jwtPayload || typeof jwtPayload === 'string' || !jwtPayload.userId || !jwtPayload.sessionId) {
      next(ApiError.UnauthorizedError());

      return;
    }

    const session = await SessionQueryRepository.find(jwtPayload.sessionId as string);

    const extendedAt = session?.extendedAt;

    if (extendedAt !== jwtPayload.extendedAt) {
      next(ApiError.UnauthorizedError());

      return;
    }

    request.userId = jwtPayload.userId;
    request.sessionId = jwtPayload.sessionId;

    next();
  } catch (error) {
    next(ApiError.UnauthorizedError());
  }
};
