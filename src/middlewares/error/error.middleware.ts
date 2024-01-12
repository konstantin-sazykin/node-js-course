import { type NextFunction, type Request, type Response } from 'express';

import { ApiError } from '../../exeptions/api.error';

export const errorMiddleware = (
  error: ApiError | unknown,
  request: Request,
  response: Response,
  // eslint-disable-next-line no-unused-vars
  next: NextFunction,
): Response => {
  if (error instanceof ApiError) {
    const responseBody = error.errors?.length
      ? { errorsMessages: error.errors }
      : { message: error.message };

    return response.status(error.status).json(responseBody);
  }

  return response.status(503).json({ message: 'Непревиденная ошибка сервера' });
};
