import { type ValidationChain, body, param } from 'express-validator';

import { type NextFunction, type Request, type Response } from 'express';

import { inputModelValidation } from '../exeptions/validation.error';
import { CommentQueryRepository } from '../repositories/comment/comment.query-repository';

import { requestParamsValidation } from './common';

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
  const isCommentDefined = await CommentQueryRepository.find(id);

  if (!isCommentDefined) {
    throw new Error(`Комментарий с id ${id} не найден`);
  }
});

export const commentIdParamValidation = (): [
  ValidationChain,
  (request: Request, response: Response, next: NextFunction) => void,
] => [idValidation, requestParamsValidation];
