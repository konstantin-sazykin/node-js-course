import {body, param} from 'express-validator'
import { inputModelValidation } from 'src/exeptions/validation.error';


const nameValidation = body('name')
  .isString()
  .trim()
  .isLength({
    min: 1,
    max: 15
  })
  .withMessage('Invalid name field')

const descriptionValidation = body('description')
  .isString()
  .trim()
  .isLength({
    min: 1,
    max: 500
  })
  .withMessage('Invalid description field')

const websiteUrlValidation = body('websiteUrl')
  .isString()
  .trim()
  .isLength({
    min: 1,
    max: 100
  })
  .matches('^https://([a-zA-Z0-9_-]+.)+[a-zA-Z0-9_-]+(/[a-zA-Z0-9_-]+)*/?$')
  .withMessage('Invalid websiteUrl field')

// реализация не через regex а через встроеную проверку на URL
// const websiteUrlValidation = body('name').isString().trim().isLength({ min: 1, max: 100 }).isURL().withMessage('Invalid websiteUrl field');

export const blogPostValidation = () => [
  nameValidation,
  descriptionValidation,
  websiteUrlValidation,
  inputModelValidation
];

const idValidation = param('id').isUUID();

export const blogParamsValidation = () => [
  idValidation,
  inputModelValidation,
];
