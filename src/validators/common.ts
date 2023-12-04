import { NextFunction, Request, Response } from 'express';
import { param, validationResult } from 'express-validator';
import { ApiError } from '../exeptions/api.error';
import { ResponseStatusCodesEnum } from '../utils/constants';


const idValidation = param('id').isMongoId();

export const requestParamsValidation = (request: Request, response: Response, next: NextFunction) => {
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return next(new ApiError(ResponseStatusCodesEnum.NotFound, null));
  }

  next();
};

export const paramValidation = () => [idValidation, requestParamsValidation];
