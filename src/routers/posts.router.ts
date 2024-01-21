// @ts-nocheck
import { Router } from 'express';

import { adminMiddleware } from '../middlewares/admin/admin.middleware';
import {
  postGetParamValidation,
  postWithBlogIdCreateValidation,
} from '../validators/post.validator';
import { paramValidation } from '../validators/common';
import { authMiddleware } from '../middlewares/auth/auth.middleware';
import { commentCreateValidation, likeInputValidation } from '../validators/comment.validator';
import { commentController, postController } from '../composition-root';
import { userDataMiddleware } from '../middlewares/userData/userData.middleware';

export const postsRouter = Router();

postsRouter.get('/', postController.getAll.bind(postController));
postsRouter.get('/:id', paramValidation(), postController.getById.bind(postController));
postsRouter.post('/', adminMiddleware, postWithBlogIdCreateValidation(), postController.post.bind(postController));
postsRouter.put(
  '/:id',
  adminMiddleware,
  paramValidation(),
  postWithBlogIdCreateValidation(),
  postController.put.bind(postController),
);
postsRouter.delete('/:id', adminMiddleware, paramValidation(), postController.delete.bind(postController));
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
postsRouter.put(
  '/:id/like-status',
  authMiddleware,
  postGetParamValidation(),
  likeInputValidation(),
  commentController.postCommentByPostId.bind(commentController),
);
