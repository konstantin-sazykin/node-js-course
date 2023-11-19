import { type Request, type Response, Router, NextFunction } from 'express';

import { BlogRepository } from '@/repositories/blog.respository';
import { authMiddleware } from '@/middlewares/auth/auth.middleware';
import { type RequestType, ResponseStatusCodesEnum } from '@/types/common';
import { type BlogParams, type BlogCreateDTO } from '@/types/blog/input';
import { ApiError } from '@/exeptions/api.error';
import { blogPostValidation } from '@/validators/blog.validator';
import { db } from '@/db/db';
import { QueryBlog, QueryBlogDTO } from '@/types/blog/output';

export const blogsRouter = Router();

blogsRouter.get('/', (request: Request, response: Response<QueryBlogDTO[]>) => {
  const blogs = BlogRepository.getAllBlogs();

  return response.send(blogs.map((blog) => ({ ...new QueryBlog(blog) })));
});

blogsRouter.get(
  '/:id',
  authMiddleware,
  (request: RequestType<BlogParams, {}>, response: Response<QueryBlogDTO>) => {
    const { id } = request.params;
    const blog = BlogRepository.getBlogById(id);

    if (!blog) {
      throw new ApiError(ResponseStatusCodesEnum.NotFound, 'Блог с указанны id не найден');
    }

    return response.send({ ...new QueryBlog(blog) });
  }
);

blogsRouter.post(
  '/',
  authMiddleware,
  blogPostValidation(),
  (request: RequestType<{}, BlogCreateDTO>, response: Response<QueryBlogDTO>) => {
    const { description, name, websiteUrl } = request.body;

    const id = String(Date.now());

    db.blogs.push({ description, name, websiteUrl, id });
    const createdBlog = db.blogs.find((blog) => blog.id === id);

    if (createdBlog) {
      return response.send({ ...new QueryBlog(createdBlog) });
    } else {
      throw new ApiError(ResponseStatusCodesEnum.InternalError, null);
    }
  }
);
