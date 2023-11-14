import { NextFunction, Request, Response } from 'express';
import { ApiError } from '../../exeptions/api.error';
import { ResponseStatusCodesEnum } from '../../types/common';

export const errorMiddleware = (
  err: ApiError | unknown,
  request: Request,
  response: Response,
) => {
  if (err instanceof ApiError) {
    return response.status(err.status).json({ message: err.message, errors: err.errors });
  }

  return response.status(ResponseStatusCodesEnum.InternalError).json({ message: 'Непревиденная ошибка сервера' });
};
