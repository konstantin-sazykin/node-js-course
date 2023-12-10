import { body } from 'express-validator';
import { inputModelValidation } from '../exeptions/validation.error';

const loginOrEmailValidation = body('login')
  .isString()
  .trim()
  .matches(/^[a-zA-Z0-9_-]*$/)
  .isLength({ min: 3, max: 10 });


const passwordValidation = body('password')
  .isString()
  .trim()
  .isLength({ min: 6, max: 20 });

const emailValidation = body('email')
  .isString()
  .trim()
  .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)

export const userDataValidation = () => [
  loginOrEmailValidation,
  passwordValidation,
  emailValidation,
  inputModelValidation,
];
