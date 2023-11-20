import { type Request, type Response, Router, NextFunction } from 'express';

import { BlogsRepository } from '../repositories/blog.repository';
import { QueryBlogOutputModel } from '../types/blog/output';
import { QueryBlogDTO } from '../dto/blog.dto';
import { RequestType } from '../types/common';
import { BlogParams, CreateBlogInputModel, UpdateBlogInputModel } from '../types/blog/input';
import { ResponseStatusCodesEnum } from '../utils/constants';
import { ApiError } from '../exeptions/api.error';
import { authMiddleware } from '../middlewares/auth/auth.middleware';
import { blogPostValidation } from '../validators/blog.validator';



export const blogsRouter = Router();

blogsRouter.get('/', (request: Request, response: Response<QueryBlogOutputModel[]>) => {
  const blogs = BlogsRepository.getAllBlogs();

  return response.send(blogs.map((blog) => ({ ...new QueryBlogDTO(blog) })));
});

blogsRouter.get(
  '/:id',
  (request: RequestType<BlogParams, {}>, response: Response<QueryBlogOutputModel>) => {
    const { id } = request.params;
    const blog = BlogsRepository.getBlogById(id);

    if (!blog) {
      throw new ApiError(ResponseStatusCodesEnum.NotFound, 'Блог с указанны id не найден');
    }

    return response.send({ ...new QueryBlogDTO(blog) });
  }
);

blogsRouter.post(
  '/',
  authMiddleware,
  blogPostValidation(),
  (request: RequestType<{}, CreateBlogInputModel>, response: Response<QueryBlogOutputModel>) => {
    const createdBlog = BlogsRepository.createBlog(request.body);

    if (createdBlog) {
      return response
        .status(ResponseStatusCodesEnum.Created)
        .send({ ...new QueryBlogDTO(createdBlog) });
    } else {
      throw new ApiError(ResponseStatusCodesEnum.InternalError, null);
    }
  }
);

blogsRouter.put(
  '/:id',
  authMiddleware,
  blogPostValidation(),
  (request: RequestType<BlogParams, UpdateBlogInputModel>, response: Response) => {
    const blogId = request.params.id;
    const isBlogExists = !!BlogsRepository.getBlogById(blogId);

    if (!isBlogExists) {
      throw new ApiError(ResponseStatusCodesEnum.NotFound, 'Блог с указанныи id не найден');
    }

    const isBlogUpdated = BlogsRepository.updateBlog(request.params.id, request.body);

    if (isBlogUpdated) {
      return response.sendStatus(ResponseStatusCodesEnum.NoContent);
    } else {
      throw new ApiError(ResponseStatusCodesEnum.InternalError, null);
    }
  }
);

blogsRouter.delete(
  '/:id',
  authMiddleware,
  (request: RequestType<BlogParams, {}>, response: Response) => {
    const blogId = request.params.id;

    const isBlogExists = !!BlogsRepository.getBlogById(blogId);

    if (!isBlogExists) {
      throw new ApiError(ResponseStatusCodesEnum.NotFound, 'Блог с указанныи id не найден');
    }

    const isBlogDeleted = BlogsRepository.deleteBlog(blogId);

    if (isBlogDeleted) {
      return response.sendStatus(ResponseStatusCodesEnum.NoContent);
    } else {
      throw new ApiError(ResponseStatusCodesEnum.InternalError, null);
    }
  }
);
