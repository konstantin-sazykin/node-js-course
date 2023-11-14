import { Request, Response, Router } from 'express';

import { BlogRepository } from '../repositories/blog.respository';
import { RequestType, ResponseStatusCodesEnum } from '../types/common';
import { ApiError } from '../exeptions/api.error';
import { BlogParams } from '../types/blog/input';

export const blogRoute = Router();

blogRoute.get('/', (request: Request, response: Response) => {
  const blogs = BlogRepository.getAllBlogs();

  return response.send(blogs);
});

blogRoute.get('/:id', (request: RequestType<BlogParams, {}>, response: Response) => {
  const id = request.params.id;
  const blog = BlogRepository.getBlogById(id);

  if (!blog) {
    throw new ApiError(ResponseStatusCodesEnum.NotFound, 'Блог с указанны id не найден');
  }

  response.send(blog);
});
