import { Router } from 'express';

import { adminMiddleware } from '../middlewares/admin/admin.middleware';
import { postWithBlogIdCreateValidation } from '../validators/post.validator';
import { paramValidation } from '../validators/common';
import { PostController } from '../conrollers/post.controller';

export const postsRouter = Router();

postsRouter.get('/', PostController.getAll);
postsRouter.get('/:id', paramValidation(), PostController.getById);
postsRouter.post('/', adminMiddleware, postWithBlogIdCreateValidation(), PostController.post);
postsRouter.put(
  '/:id',
  adminMiddleware,
  paramValidation(),
  postWithBlogIdCreateValidation(),
  PostController.put
);
postsRouter.delete('/:id', adminMiddleware, paramValidation(), PostController.delete);
