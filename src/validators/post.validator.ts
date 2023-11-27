import { body } from 'express-validator';
import { inputModelValidation } from '../exeptions/validation.error';
import { BlogsRepository } from '../repositories/blog.repository';

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
  .custom(async (blogId) => {
    const isBlogDefined = await BlogsRepository.getBlogById(blogId);

    if (!isBlogDefined) {
      throw new Error(`Блог с id ${blogId} не найден`);
    }
  })
  .withMessage('Invalid blogId field');

export const postCreateValidation = () => [
  titleValidation,
  shortDescriptionValidation,
  contentValidation,
  blogIdValidation,
  inputModelValidation,
];
