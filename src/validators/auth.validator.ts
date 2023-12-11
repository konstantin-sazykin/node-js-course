import { body } from 'express-validator';
import { inputModelValidation } from '../exeptions/validation.error';

const loginOrEmailValidation = body('loginOrEmail')
  .isString()
  .trim()
  .isLength({ min: 3, max: 30 });

const passwordValidation = body('password')
  .isString()
  .trim()
  .isLength({ min: 3, max: 50 })

export const authPostValidation = () => [
  loginOrEmailValidation,
  passwordValidation,
  inputModelValidation,
];
