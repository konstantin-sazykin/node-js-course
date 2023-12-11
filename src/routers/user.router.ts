import { Router } from 'express';
import { UserController } from '../conrollers/user.controller';
import { authMiddleware } from '../middlewares/auth/auth.middleware';
import { userDataValidation } from '../validators/user.validator';

export const userRouter = Router();

userRouter.get('/', authMiddleware, UserController.getAll);
userRouter.post('/', authMiddleware, userDataValidation(), UserController.post);
userRouter.delete('/:id', authMiddleware, UserController.delete);
