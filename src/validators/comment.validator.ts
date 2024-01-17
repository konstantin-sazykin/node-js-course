import { type ValidationChain, body, param } from 'express-validator';

import { type NextFunction, type Request, type Response } from 'express';

import { inputModelValidation } from '../exeptions/validation.error';

import { requestParamsValidation } from './common';
import { commentQueryRepository } from '../composition-root';

const commentContentValidation = body('content').isString().trim().isLength({ min: 20, max: 300 });

export const commentCreateValidation = (): [
  ValidationChain,
  (request: Request, response: Response, next: NextFunction) => void,
] => [commentContentValidation, inputModelValidation];
export const commentUpdateValidation = (): [
  ValidationChain,
  (request: Request, response: Response, next: NextFunction) => void,
] => [commentContentValidation, inputModelValidation];

const idValidation = param('id').custom(async (id: string) => {
  const isCommentDefined = await commentQueryRepository.find(id);

  if (!isCommentDefined) {
    throw new Error(`Комментарий с id ${id} не найден`);
  }
});

export const commentIdParamValidation = (): [
  ValidationChain,
  (request: Request, response: Response, next: NextFunction) => void,
] => [idValidation, requestParamsValidation];
