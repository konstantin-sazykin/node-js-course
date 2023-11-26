import { body, param, validationResult } from 'express-validator';
import { inputModelValidation } from '../exeptions/validation.error';
import { NextFunction, Request, Response } from 'express';
import { ApiError } from '../exeptions/api.error';
import { ResponseStatusCodesEnum } from '../utils/constants';

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
  .isLength({ min: 10, max: 15 })
  .withMessage('Invalid blogId field');

export const postCreateValidation = () => [
  titleValidation,
  shortDescriptionValidation,
  contentValidation,
  blogIdValidation,
  inputModelValidation,
];
