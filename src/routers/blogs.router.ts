// @ts-nocheck
import { Router } from 'express';

import { adminMiddleware } from '../middlewares/admin/admin.middleware';
import { blogParamValidation, blogPostValidation } from '../validators/blog.validator';
import { paramValidation } from '../validators/common';
import { postCreateValidation } from '../validators/post.validator';
import { blogController } from '../composition-root';

export const blogsRouter = Router();

blogsRouter.get('/', blogController.getAll.bind(blogController));
blogsRouter.get('/:id', paramValidation(), blogController.getById.bind(blogController));
blogsRouter.post('/', adminMiddleware, blogPostValidation(), blogController.post.bind(blogController));
blogsRouter.put(
  '/:id',
  adminMiddleware,
  paramValidation(),
  blogPostValidation(),
  blogController.put.bind(blogController),
);
blogsRouter.delete('/:id', adminMiddleware, paramValidation(), blogController.delete.bind(blogController));
blogsRouter.post(
  '/:id/posts',
  adminMiddleware,
  blogParamValidation(),
  postCreateValidation(),
  blogController.postForId.bind(blogController),
);
blogsRouter.get('/:id/posts', blogParamValidation(), blogController.getPostsForBlogById.bind(blogController));
