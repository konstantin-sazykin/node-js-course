import { Router } from 'express';
import { CommentController } from '../conrollers/comment.controller';
import { commentIdParamValidation, commentUpdateValidation } from '../validators/comment.validator';
import { authMiddleware } from '../middlewares/auth/auth.middleware';
import { commentAuthorMiddleware } from '../middlewares/commentAuthor/commentAuthor.middleware';

export const commentRouter = Router();

commentRouter.get('/:id', commentIdParamValidation(), CommentController.getById);

commentRouter.put(
  '/:id',
  commentIdParamValidation(),
  authMiddleware,
  commentAuthorMiddleware,
  commentUpdateValidation(),
  CommentController.put
);

commentRouter.delete(
  '/:id',
  commentIdParamValidation(),
  authMiddleware,
  commentAuthorMiddleware,
  CommentController.delete
);
