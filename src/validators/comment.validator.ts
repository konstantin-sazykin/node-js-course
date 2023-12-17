import { body, param, validationResult } from 'express-validator';
import { inputModelValidation } from '../exeptions/validation.error';
import { CommentQueryRepository } from '../repositories/comment/comment.query-repository';
import { requestParamsValidation } from './common';

const commentContentValidation = body('content').isString().trim().isLength({ min: 20, max: 300 });

export const commentCreateValidation = () => [commentContentValidation, inputModelValidation];
export const commentUpdateValidation = () => [commentContentValidation, inputModelValidation];

const idValidation = param('id').custom(async (id) => {
  const isCommentDefined = await CommentQueryRepository.find(id);

  if (!isCommentDefined) {
    throw new Error(`Комментарий с id ${id} не найден`);
  }
});

export const commentIdParamValidation = () => [idValidation, requestParamsValidation];
