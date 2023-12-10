import { body } from 'express-validator';
import { inputModelValidation } from '../exeptions/validation.error';

const loginOrEmailValidation = body('loginOrEmail')
  .exists()
  .isString()

const passwordValidation = body('password').exists().isString().withMessage('password is required');

export const authPostValidation = () => [
  loginOrEmailValidation,
  passwordValidation,
  inputModelValidation,
];
