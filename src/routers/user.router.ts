import { Router } from 'express';

import { adminMiddleware } from '../middlewares/admin/admin.middleware';
import { userDataValidation } from '../validators/user.validator';
import { userController } from '../composition-root';

export const userRouter = Router();

// @ts-expect-error
userRouter.get('/', adminMiddleware, userController.getAll.bind(userController));
userRouter.post('/', adminMiddleware, userDataValidation(), userController.post.bind(userController));
userRouter.delete('/:id', adminMiddleware, userController.delete.bind(userController));
