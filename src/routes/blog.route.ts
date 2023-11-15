import { Request, Response, Router } from 'express';

import { BlogRepository } from '../repositories/blog.respository';
import { RequestType, ResponseStatusCodesEnum } from '../types/common';
import { ApiError } from '../exeptions/api.error';
import { BlogParams, CreateBlogDTO } from '../types/blog/input';
import { authMiddleware } from '../middlewares/auth/auth.middleware';
import { db } from '../db/db';
import { blogPostValidation } from '../validators/blog.validator';

export const blogRoute = Router();

blogRoute.get('/', (request: Request, response: Response) => {
  const blogs = BlogRepository.getAllBlogs();

  return response.send(blogs);
});

blogRoute.get(
  '/:id',
  authMiddleware,
  (request: RequestType<BlogParams, {}>, response: Response) => {
    const id = request.params.id;
    const blog = BlogRepository.getBlogById(id);

    if (!blog) {
      throw new ApiError(ResponseStatusCodesEnum.NotFound, 'Блог с указанны id не найден');
    }

    response.send(blog);
  }
);

blogRoute.post('/', authMiddleware, blogPostValidation(), (request: RequestType<{}, CreateBlogDTO>, response: Response) => {
    const { description, name, websiteUrl } = request.body;

    const id = String(Date.now());

    db.blogs.push({ description, name, websiteUrl, id });

    return response.send(db.blogs.find(blog => blog.id === id)); 
  }
);
