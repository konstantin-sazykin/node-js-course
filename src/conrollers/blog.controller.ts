import { type NextFunction, type Response } from 'express';

import {
  type BlogParams,
  type CreateBlogInputModel,
  type QuerySortedBlogsType,
  type UpdateBlogInputModel,
} from '../types/blog/input';
import { type QueryBlogOutputModel } from '../types/blog/output';
import { type QueryRequestType, type RequestType, type ResponseWithPagination } from '../types/common';
import { BlogSortData, PostSortData } from '../utils/SortData';
import { BlogQueryRepository } from '../repositories/blog/blog.query.repository';
import { ResponseStatusCodesEnum } from '../utils/constants';
import { ApiError } from '../exeptions/api.error';
import { BlogService } from '../domain/blog.service';
import { type CreatePostWithBlogIdInputModel, type QuerySortedPostsType } from '../types/post/input';
import { type QueryPostOutputModel } from '../types/post/output';
import { PostService } from '../domain/post.service';
import { PostQueryRepository } from '../repositories/post/post.query.repository';

export class BlogController {
  static async getAll(
    request: QueryRequestType<{}, QuerySortedBlogsType>,
    response: ResponseWithPagination<QueryBlogOutputModel>,
    next: NextFunction,
  ) {
    try {
      const sortData = new BlogSortData(request.query);

      const blogs = await BlogQueryRepository.getAllBlogs(sortData);

      response.send(blogs);
    } catch (error) {
      next(error);
    }
  }

  static async getById(
    request: RequestType<BlogParams, {}>,
    response: Response<QueryBlogOutputModel>,
    next: NextFunction,
  ) {
    try {
      const { id } = request.params;
      const blog = await BlogQueryRepository.getBlogById(id);

      if (!blog) {
        throw new ApiError(ResponseStatusCodesEnum.NotFound, 'Блог с указанны id не найден');
      }

      response.send(blog);
    } catch (error) {
      next(error);
    }
  }

  static async post(
    request: RequestType<{}, CreateBlogInputModel>,
    response: Response<QueryBlogOutputModel>,
    next: NextFunction,
  ) {
    try {
      const createdBlog = await BlogService.createBlog(request.body);

      if (!createdBlog) {
        throw new ApiError(ResponseStatusCodesEnum.InternalError, 'Не удалось создать блог');
      }
      response.status(ResponseStatusCodesEnum.Created).send(createdBlog);
    } catch (error) {
      next(error);
    }
  }

  static async put(
    request: RequestType<BlogParams, UpdateBlogInputModel>,
    response: Response,
    next: NextFunction,
  ) {
    try {
      const isBlogUpdated = await BlogService.updateBlog(request.params.id, request.body);

      if (!isBlogUpdated) {
        throw new ApiError(ResponseStatusCodesEnum.NotFound, null);
      }

      response.sendStatus(ResponseStatusCodesEnum.NoContent);
    } catch (error) {
      next(error);
    }
  }

  static async delete(
    request: RequestType<BlogParams, {}>,
    response: Response,
    next: NextFunction,
  ) {
    try {
      const blogId = request.params.id;

      const isBlogDeleted = await BlogService.deleteBlog(blogId);

      if (!isBlogDeleted) {
        throw new ApiError(ResponseStatusCodesEnum.NotFound, 'Блог с указанным id не найден');
      }
      response.sendStatus(ResponseStatusCodesEnum.NoContent);
    } catch (error) {
      next(error);
    }
  }

  static async postForId(
    request: RequestType<BlogParams, CreatePostWithBlogIdInputModel>,
    response: Response<QueryPostOutputModel>,
    next: NextFunction,
  ) {
    try {
      const blogId = request.params.id;

      const newPost = await PostService.createPostByBlogId(blogId, request.body);

      if (!newPost) {
        throw new ApiError(ResponseStatusCodesEnum.InternalError, 'Не удалось создать блог');
      }

      response.status(ResponseStatusCodesEnum.Created).send(newPost);
    } catch (error) {
      next(error);
    }
  }

  static async getPostsForBlogById(
    request: QueryRequestType<BlogParams, QuerySortedPostsType>,
    response: ResponseWithPagination<QueryPostOutputModel>,
    next: NextFunction,
  ) {
    try {
      const blogId = request.params.id;
      const sortData = new PostSortData(request.query);
      const posts = await PostQueryRepository.getAllByBlogId(blogId, sortData);

      response.send(posts);
    } catch (error) {
      next(error);
    }
  }
}
