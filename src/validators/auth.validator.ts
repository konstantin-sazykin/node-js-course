import { type NextFunction, type Request, type Response } from 'express';
import { type ValidationChain, body } from 'express-validator';

import { inputModelValidation } from '../exeptions/validation.error';
import { UserRepository } from '../repositories/user/user.repository';
import { JWTService } from '../application/jwt.service';

const loginOrEmailValidation = body('loginOrEmail').isString().trim().isLength({ min: 3, max: 30 });

const passwordValidation = body('password').isString().trim().isLength({ min: 3, max: 50 });

export const authPostValidation = (): [
  ValidationChain,
  ValidationChain,
  (request: Request, response: Response, next: NextFunction) => void,
] => [loginOrEmailValidation, passwordValidation, inputModelValidation];

const newRegistrationEmailFormatValidation = body('email')
  .isString()
  .trim()
  .matches(/^[\w\-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
  .withMessage('Invalid value');

const newRegistrationEmailExistValidation = body('email').custom(async (email: string) => {
  const isEmailAlreadyInUse = await UserRepository.checkUserByLoginOrEmail(email);

  if (isEmailAlreadyInUse) {
    throw new Error('Адрес электронной почты уже используется');
  }
});

const newRegistrationLoginFormatValidation = body('login')
  .isString()
  .trim()
  .matches(/^[a-zA-Z0-9_-]*$/)
  .isLength({ min: 3, max: 10 })
  .withMessage('Invalid value');

const newRegistrationPasswordFormatValidation = body('password')
  .isString()
  .trim()
  .isLength({ min: 6, max: 20 })
  .withMessage('Invalid value');

const newRegistrationLoginExistValidation = body('login').custom(async (email: string) => {
  const isEmailAlreadyInUse = await UserRepository.checkUserByLoginOrEmail(email);

  if (isEmailAlreadyInUse) {
    throw new Error('Логин уже используется');
  }
});

export const authRegistrationDataValidation = (): [
  ValidationChain,
  ValidationChain,
  ValidationChain,
  ValidationChain,
  ValidationChain,
  (request: Request, response: Response, next: NextFunction) => void,
] => [
  newRegistrationEmailFormatValidation,
  newRegistrationEmailExistValidation,
  newRegistrationLoginFormatValidation,
  newRegistrationLoginExistValidation,
  newRegistrationPasswordFormatValidation,
  inputModelValidation,
];

const confirmationCodeValidation = body('code')
  .isString()
  .trim()
  .isJWT()
  .custom(async (code: string) => {
    const tokenInfo = JWTService.validateToken(code);

    if (!tokenInfo) {
      throw new Error('Невалидный код, или срок его действия истек');
    }

    const email: string = typeof tokenInfo === 'string' ? tokenInfo : tokenInfo.email;

    const user = await UserRepository.checkUserByLoginOrEmail(email);

    if (!user) {
      throw new Error('Не найден пользователь');
    }

    if (user.isConfirmed) {
      throw new Error('Адрес электронной почты уже подтвержден');
    }
  });

export const authConfirmationCodeValidation = (): [
  ValidationChain,
  (request: Request, response: Response, next: NextFunction) => void,
] => [confirmationCodeValidation, inputModelValidation];

const emailValidation = body('email')
  .isString()
  .trim()
  .isEmail()
  .custom(async (email: string) => {
    const user = await UserRepository.checkUserByLoginOrEmail(email);

    if (!user) {
      throw new Error('Не найден пользователь');
    }

    if (user.isConfirmed) {
      throw new Error('Адрес электронной почты уже подтвержден');
    }
  });

export const authResendEmailConfirmationValidation = (): [
  ValidationChain,
  (request: Request, response: Response, next: NextFunction) => void,
] => [emailValidation, inputModelValidation];
