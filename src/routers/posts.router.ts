import { Router } from 'express';

import { adminMiddleware } from '../middlewares/admin/admin.middleware';
import {
  postGetParamValidation,
  postWithBlogIdCreateValidation,
} from '../validators/post.validator';
import { paramValidation } from '../validators/common';
import { PostController } from '../conrollers/post.controller';
import { CommentController } from '../conrollers/comment.controller';
import { authMiddleware } from '../middlewares/auth/auth.middleware';
import { commentCreateValidation } from '../validators/comment.validator';

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
postsRouter.get('/:id/comments', postGetParamValidation(), CommentController.getCommentsByPostId);
postsRouter.post(
  '/:id/comments',
  authMiddleware,
  postGetParamValidation(),
  commentCreateValidation(),
  CommentController.postCommentByPostId
);
