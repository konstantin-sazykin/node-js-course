import { Router } from 'express';
import { AuthController } from '../conrollers/auth.controller';
import { authPostValidation } from '../validators/auth.validator';
import { authMiddleware } from '../middlewares/auth/auth.middleware';

export const authRouter = Router();

authRouter.post('/login', authPostValidation(), AuthController.post);
authRouter.get('/me', authMiddleware, AuthController.getUser);
  