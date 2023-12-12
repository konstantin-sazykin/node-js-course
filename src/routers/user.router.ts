import { Router } from 'express';
import { UserController } from '../conrollers/user.controller';
import { adminMiddleware } from '../middlewares/auth/admin.middleware';
import { userDataValidation } from '../validators/user.validator';

export const userRouter = Router();

userRouter.get('/', adminMiddleware, UserController.getAll);
userRouter.post('/', adminMiddleware, userDataValidation(), UserController.post);
userRouter.delete('/:id', adminMiddleware, UserController.delete);
