// @ts-nocheck
import { Router } from 'express';

import { commentIdParamValidation, commentUpdateValidation, likeInputValidation } from '../validators/comment.validator';
import { authMiddleware } from '../middlewares/auth/auth.middleware';
import { commentAuthorMiddleware } from '../middlewares/commentAuthor/commentAuthor.middleware';
import { commentController } from '../composition-root';
import { userDataMiddleware } from '../middlewares/userData/userData.middleware';

export const commentRouter = Router();

commentRouter.get(
  '/:id',
  commentIdParamValidation(),
  userDataMiddleware,
  commentController.getById.bind(commentController),
);

commentRouter.put(
  '/:id',
  commentIdParamValidation(),
  authMiddleware,
  commentAuthorMiddleware,
  commentUpdateValidation(),
  commentController.put.bind(commentController),
);

commentRouter.put(
  '/:id/like-status',
  commentIdParamValidation(),
  authMiddleware,
  likeInputValidation(),
  commentController.putLikeForComment.bind(commentController),
);

commentRouter.delete(
  '/:id',
  commentIdParamValidation(),
  authMiddleware,
  commentAuthorMiddleware,
  commentController.delete.bind(commentController),
);
