// @ts-nocheck
import { Router } from 'express';

import { adminMiddleware } from '../middlewares/admin/admin.middleware';
import {
  postGetParamValidation,
  postWithBlogIdCreateValidation,
} from '../validators/post.validator';
import { paramValidation } from '../validators/common';
import { PostController } from '../conrollers/post.controller';
import { authMiddleware } from '../middlewares/auth/auth.middleware';
import { commentCreateValidation } from '../validators/comment.validator';
import { commentController } from '../composition-root';
import { userDataMiddleware } from '../middlewares/userData/userData.middleware';

export const postsRouter = Router();

postsRouter.get('/', PostController.getAll);
postsRouter.get('/:id', paramValidation(), PostController.getById);
postsRouter.post('/', adminMiddleware, postWithBlogIdCreateValidation(), PostController.post);
postsRouter.put(
  '/:id',
  adminMiddleware,
  paramValidation(),
  postWithBlogIdCreateValidation(),
  PostController.put,
);
postsRouter.delete('/:id', adminMiddleware, paramValidation(), PostController.delete);
postsRouter.get(
  '/:id/comments',
  postGetParamValidation(),
  userDataMiddleware,
  commentController.getCommentsByPostId.bind(commentController),
);
postsRouter.post(
  '/:id/comments',
  authMiddleware,
  postGetParamValidation(),
  commentCreateValidation(),
  commentController.postCommentByPostId.bind(commentController),
);
