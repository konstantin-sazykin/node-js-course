// @ts-nocheck
import { Router } from 'express';

import { adminMiddleware } from '../middlewares/admin/admin.middleware';
import { blogParamValidation, blogPostValidation } from '../validators/blog.validator';
import { paramValidation } from '../validators/common';
import { postCreateValidation } from '../validators/post.validator';
import { BlogController } from '../conrollers/blog.controller';

export const blogsRouter = Router();

blogsRouter.get('/', BlogController.getAll);
blogsRouter.get('/:id', paramValidation(), BlogController.getById);
blogsRouter.post('/', adminMiddleware, blogPostValidation(), BlogController.post);
blogsRouter.put(
  '/:id',
  adminMiddleware,
  paramValidation(),
  blogPostValidation(),
  BlogController.put,
);
blogsRouter.delete('/:id', adminMiddleware, paramValidation(), BlogController.delete);
blogsRouter.post(
  '/:id/posts',
  adminMiddleware,
  blogParamValidation(),
  postCreateValidation(),
  BlogController.postForId,
);
blogsRouter.get('/:id/posts', blogParamValidation(), BlogController.getPostsForBlogById);
