import { type NextFunction, type Request, type Response } from 'express';
import { ApiError } from '../../exeptions/api.error';
import { db } from '../../db/db';

export const authMiddleware = (request: Request, response: Response, next: NextFunction) => {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    next(ApiError.UnauthorizedError());
    return;
  }

  try {
    const [tokenType, token] = authHeader.split(' ');

    if (tokenType !== 'Basic') {
      next(ApiError.UnauthorizedError());
      return;
    }

    const [decodedLogin, decodedPassword] = atob(token).split(':');

    if (decodedLogin !== db.defaultUser.login || decodedPassword !== db.defaultUser.password) {
      next(ApiError.UnauthorizedError());
      return;
    }

    next();
  } catch (error) {
    next(ApiError.BadRequest(null, 'Не удалось проверить токен пользователя'));
  }
};
