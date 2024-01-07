import { type NextFunction, type Request, type Response } from 'express';
import { type ValidationChain, param, validationResult } from 'express-validator';

import { ApiError } from '../exeptions/api.error';
import { ResponseStatusCodesEnum } from '../utils/constants';

const idValidation = param('id').isMongoId();

export const requestParamsValidation = (request: Request, response: Response, next: NextFunction): void => {
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    next(new ApiError(ResponseStatusCodesEnum.NotFound, null)); return;
  }

  next();
};

export const paramValidation = (): [
  ValidationChain,
  (request: Request, response: Response, next: NextFunction) => void,
] => [idValidation, requestParamsValidation];
