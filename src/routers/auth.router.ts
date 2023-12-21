import { Router } from 'express';

import { AuthController } from '../conrollers/auth.controller';
import { authConfirmationCodeValidation, authPostValidation, authRegistrationDataValidation } from '../validators/auth.validator';
import { authMiddleware } from '../middlewares/auth/auth.middleware';

export const authRouter = Router();

authRouter.post('/login', authPostValidation(), AuthController.postLogin);
authRouter.get('/me', authMiddleware, AuthController.getUser);
authRouter.post('/registration', authRegistrationDataValidation(), AuthController.postRegistration);
authRouter.post('/registration-confirmation', authConfirmationCodeValidation(), AuthController.confirmRegistration);