import { type ValidationChain, body, param } from 'express-validator';

import { type NextFunction, type Request, type Response } from 'express';

import { inputModelValidation } from '../exeptions/validation.error';

import { blogQueryRepository, postQueryRepository } from '../composition-root';

import { requestParamsValidation } from './common';

const titleValidation = body('title')
  .isString()
  .trim()
  .isLength({ min: 1, max: 30 })
  .withMessage('Invalid title field');

const shortDescriptionValidation = body('shortDescription')
  .isString()
  .trim()
  .isLength({ min: 1, max: 100 })
  .withMessage('Invalid shortDescription field');

const contentValidation = body('content')
  .isString()
  .trim()
  .isLength({ min: 1, max: 1000 })
  .withMessage('Invalid content field');

const blogIdValidation = body('blogId')
  .isString()
  .trim()
  .isMongoId()
  .custom(async (blogId: string) => {
    const isBlogDefined = await blogQueryRepository.getBlogById(blogId);

    if (!isBlogDefined) {
      throw new Error(`Блог с id ${blogId} не найден`);
    }
  })
  .withMessage('Invalid blogId field');

const postIdValidation = param('id').custom(async (postId: string) => {
  const isPostDefined = await postQueryRepository.getById(postId);

  if (!isPostDefined) {
    throw new Error(`Пост с id ${postId} не найден`);
  }
});

export const postWithBlogIdCreateValidation = (): [
  ValidationChain,
  ValidationChain,
  ValidationChain,
  ValidationChain,
  (request: Request, response: Response, next: NextFunction) => void,
] => [
  titleValidation,
  shortDescriptionValidation,
  contentValidation,
  blogIdValidation,
  inputModelValidation,
];

export const postCreateValidation = (): [
  ValidationChain,
  ValidationChain,
  ValidationChain,
  (request: Request, response: Response, next: NextFunction) => void,
] => [titleValidation, shortDescriptionValidation, contentValidation, inputModelValidation];

export const postGetParamValidation = (): [
  ValidationChain,
  (request: Request, response: Response, next: NextFunction) => void,
] => [postIdValidation, requestParamsValidation];
