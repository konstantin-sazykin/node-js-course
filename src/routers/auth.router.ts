import { Router } from 'express';

import { AuthController } from '../conrollers/auth.controller';
import { authConfirmationCodeValidation, authPostValidation, authRegistrationDataValidation, authResendEmailConfirmationValidation } from '../validators/auth.validator';
import { authMiddleware } from '../middlewares/auth/auth.middleware';

export const authRouter = Router();

authRouter.post('/login', authPostValidation(), AuthController.postLogin);
authRouter.get('/me', authMiddleware, AuthController.getUser);
authRouter.post('/registration', authRegistrationDataValidation(), AuthController.postRegistration);
authRouter.post('/registration-confirmation', authConfirmationCodeValidation(), AuthController.confirmRegistration);
authRouter.post('/registration-email-resending', authResendEmailConfirmationValidation(), AuthController.resendEmail);
authRouter.post('/refresh-token', AuthController.refresh);
authRouter.post('/logout', AuthController.logout);