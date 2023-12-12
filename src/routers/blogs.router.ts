import { Router } from 'express';

import { authMiddleware } from '../middlewares/auth/auth.middleware';
import { blogParamValidation, blogPostValidation } from '../validators/blog.validator';
import { paramValidation } from '../validators/common';
import { postCreateValidation } from '../validators/post.validator';
import { BlogController } from '../conrollers/blog.controller';

export const blogsRouter = Router();

blogsRouter.get('/', BlogController.getAll);
blogsRouter.get('/:id', paramValidation(), BlogController.getById);
blogsRouter.post('/', authMiddleware, blogPostValidation(), BlogController.post);
blogsRouter.put(
  '/:id',
  authMiddleware,
  paramValidation(),
  blogPostValidation(),
  BlogController.put
);
blogsRouter.delete('/:id', authMiddleware, paramValidation(), BlogController.delete);
blogsRouter.post(
  '/:id/posts',
  authMiddleware,
  blogParamValidation(),
  postCreateValidation(),
  BlogController.postForId
);
blogsRouter.get('/:id/posts', blogParamValidation(), BlogController.getPostsForBlogById);
