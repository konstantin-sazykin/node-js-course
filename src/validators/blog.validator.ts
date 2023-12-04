import { body, param } from 'express-validator';
import { inputModelValidation } from '../exeptions/validation.error';
import { BlogQueryRepository } from '../repositories/blog/blog.query.repository';
import { requestParamsValidation } from './common';

const nameValidation = body('name')
  .isString()
  .trim()
  .isLength({
    min: 1,
    max: 15,
  })
  .withMessage('Invalid name field');

const descriptionValidation = body('description')
  .isString()
  .trim()
  .isLength({
    min: 1,
    max: 500,
  })
  .withMessage('Invalid description field');

const websiteUrlValidation = body('websiteUrl')
  .isString()
  .trim()
  .isLength({
    min: 1,
    max: 100,
  })
  .matches('^https://([a-zA-Z0-9_-]+.)+[a-zA-Z0-9_-]+(/[a-zA-Z0-9_-]+)*/?$')
  .withMessage('Invalid websiteUrl field');

// реализация не через regex а через встроеную проверку на URL
// const websiteUrlValidation = body('name').isString().trim().isLength({ min: 1, max: 100 }).isURL().withMessage('Invalid websiteUrl field');

export const blogPostValidation = () => [
  nameValidation,
  descriptionValidation,
  websiteUrlValidation,
  inputModelValidation,
];

const blogIdValidation = param('id')
  .isString()
  .trim()
  .isMongoId()
  .custom(async (blogId) => {
    const isBlogDefined = await BlogQueryRepository.getBlogById(blogId);

    if (!isBlogDefined) {
      throw new Error(`Блог с id ${blogId} не найден`);
    }
  });

export const blogParamValidation = () => [
  blogIdValidation,
  requestParamsValidation,
]
