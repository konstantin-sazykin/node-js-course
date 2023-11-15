import { NextFunction, Request, Response } from 'express';
import { ApiError } from '../../exeptions/api.error';
import { ResponseStatusCodesEnum } from '../../types/common';

export const errorMiddleware = (
  error: ApiError | unknown,
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  if (error instanceof ApiError) {
    const responseBody = error.errors?.length ? { errorsMessages: error.errors } : { message: error.message };
  
    return response.status(error.status).json(responseBody);
  }

  return response.status(503).json({ message: 'Непревиденная ошибка сервера' });
};