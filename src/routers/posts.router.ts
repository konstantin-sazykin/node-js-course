import { Router } from 'express';

import { authMiddleware } from '../middlewares/auth/auth.middleware';
import { postWithBlogIdCreateValidation } from '../validators/post.validator';
import { paramValidation } from '../validators/common';
import { PostController } from '../conrollers/post.controller';

export const postsRouter = Router();

postsRouter.get('/', PostController.getAll);
postsRouter.get('/:id', paramValidation(), PostController.getById);
postsRouter.post('/', authMiddleware, postWithBlogIdCreateValidation(), PostController.post);
postsRouter.put(
  '/:id',
  authMiddleware,
  paramValidation(),
  postWithBlogIdCreateValidation(),
  PostController.put
);
postsRouter.delete('/:id', authMiddleware, paramValidation(), PostController.delete);
