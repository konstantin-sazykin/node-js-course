import { BlogMapper } from './../types/blog/mapper';
import { type Request, type Response, Router, NextFunction } from 'express';

import { BlogsRepository } from '../repositories/blog.repository';
import { QueryBlogOutputModel } from '../types/blog/output';
import { RequestType } from '../types/common';
import { BlogParams, CreateBlogInputModel, UpdateBlogInputModel } from '../types/blog/input';
import { ResponseStatusCodesEnum } from '../utils/constants';
import { ApiError } from '../exeptions/api.error';
import { authMiddleware } from '../middlewares/auth/auth.middleware';
import { blogPostValidation } from '../validators/blog.validator';
import { paramValidation } from '../validators/common';

export const blogsRouter = Router();

blogsRouter.get(
  '/',
  async (request: Request, response: Response<QueryBlogOutputModel[]>, next: NextFunction) => {
    try {
      const blogs = await BlogsRepository.getAllBlogs();

      response.send(blogs);
    } catch (error) {
      next(error);
    }
  }
);

blogsRouter.get(
  '/:id',
  paramValidation(),
  async (
    request: RequestType<BlogParams, {}>,
    response: Response<QueryBlogOutputModel>,
    next: NextFunction
  ) => {
    try {
      const { id } = request.params;
      const blog = await BlogsRepository.getBlogById(id);

      if (!blog) {
        throw new ApiError(ResponseStatusCodesEnum.NotFound, 'Блог с указанны id не найден');
      }

      response.send(blog);
    } catch (error) {
      next(error);
    }
  }
);

blogsRouter.post(
  '/',
  authMiddleware,
  blogPostValidation(),
  async (
    request: RequestType<{}, CreateBlogInputModel>,
    response: Response<QueryBlogOutputModel>,
    next: NextFunction
  ) => {
    try {
      const createdBlog = await BlogsRepository.createBlog(request.body);

      if (!createdBlog) {
        throw new ApiError(ResponseStatusCodesEnum.InternalError, null);
      }

      response.status(ResponseStatusCodesEnum.Created).send(createdBlog);
    } catch (error) {
      next(error);
    }
  }
);

blogsRouter.put(
  '/:id',
  authMiddleware,
  paramValidation(),
  blogPostValidation(),
  async (
    request: RequestType<BlogParams, UpdateBlogInputModel>,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const isBlogUpdated = await BlogsRepository.updateBlog(request.params.id, request.body);

      if (!isBlogUpdated) {
        throw new ApiError(ResponseStatusCodesEnum.InternalError, null);
      }

      response.sendStatus(ResponseStatusCodesEnum.NoContent);
    } catch (error) {
      next(error);
    }
  }
);

blogsRouter.delete(
  '/:id',
  authMiddleware,
  paramValidation(),
  async (request: RequestType<BlogParams, {}>, response: Response, next: NextFunction) => {
    try {
      const blogId = request.params.id;

      const isBlogDeleted = await BlogsRepository.deleteBlog(blogId);

      if (!isBlogDeleted) {
        throw new ApiError(ResponseStatusCodesEnum.NotFound, 'Блог с указанным id не найден');
      }
      response.sendStatus(ResponseStatusCodesEnum.NoContent);
    } catch (error) {
      next(error);
    }
  }
);
