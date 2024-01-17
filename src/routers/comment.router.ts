// @ts-nocheck
import { Router } from 'express';

import { commentIdParamValidation, commentUpdateValidation } from '../validators/comment.validator';
import { authMiddleware } from '../middlewares/auth/auth.middleware';
import { commentAuthorMiddleware } from '../middlewares/commentAuthor/commentAuthor.middleware';
import { commentController } from '../composition-root';

export const commentRouter = Router();

commentRouter.get('/:id', commentIdParamValidation(), commentController.getById.bind(commentController));

commentRouter.put(
  '/:id',
  commentIdParamValidation(),
  authMiddleware,
  commentAuthorMiddleware,
  commentUpdateValidation(),
  commentController.put.bind(commentController),
);

commentRouter.delete(
  '/:id',
  commentIdParamValidation(),
  authMiddleware,
  commentAuthorMiddleware,
  commentController.delete.bind(commentController),
);
