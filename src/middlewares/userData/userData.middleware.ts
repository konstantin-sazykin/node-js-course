import { type NextFunction, type Request, type Response } from 'express';

import { JWTService } from '../../application/jwt.service';

export const userDataMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction,
): void => {
  const authHeader = request.headers.authorization ?? '';

  try {
    const [tokenType, token] = authHeader.split(' ');

    if (tokenType === 'Bearer' && token) {
      const result = JWTService.validateToken(token) as { userId?: string; };

      if (result?.userId) {
        request.userId = result.userId;
      }
    }

    next();
  } catch (error) {
    next(error);
  }
};
