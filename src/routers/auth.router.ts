// @ts-nocheck
import { Router } from 'express';

import {
  authConfirmationCodeValidation,
  authPostValidation,
  authRegistrationDataValidation,
  authResendEmailConfirmationValidation,
  emailForPasswordRecoveryValidation,
  passwordForRecoveryValidation,
} from '../validators/auth.validator';
import { authMiddleware } from '../middlewares/auth/auth.middleware';
import { rateLimitMiddleware } from '../middlewares/rateLimit/rateLimit.middleware';
import { refreshTokenMiddleware } from '../middlewares/refreshToken/refreshToken.middleware';
import { authController } from '../composition-root';

export const authRouter = Router();

authRouter.post('/login', rateLimitMiddleware, authPostValidation(), authController.postLogin.bind(authController));
authRouter.get('/me', authMiddleware, authController.getUser.bind(authController));
authRouter.post(
  '/registration',
  rateLimitMiddleware,
  authRegistrationDataValidation(),
  authController.postRegistration.bind(authController),
);
authRouter.post(
  '/registration-confirmation',
  rateLimitMiddleware,
  authConfirmationCodeValidation(),
  authController.confirmRegistration.bind(authController),
);
authRouter.post(
  '/registration-email-resending',
  rateLimitMiddleware,
  authResendEmailConfirmationValidation(),
  authController.resendEmail.bind(authController),
);
authRouter.post('/refresh-token', authController.refresh);
authRouter.post('/logout', refreshTokenMiddleware, authController.logout);
authRouter.post(
  '/password-recovery',
  rateLimitMiddleware,
  emailForPasswordRecoveryValidation(),
  authController.recoveryPassword.bind(authController),
);
authRouter.post(
  '/new-password',
  rateLimitMiddleware,
  passwordForRecoveryValidation(),
  authController.createNewPassword.bind(authController),
);
