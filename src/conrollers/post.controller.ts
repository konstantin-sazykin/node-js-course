import { NextFunction, Response } from 'express';

import { QueryRequestType, RequestType, ResponseWithPagination } from '../types/common';
import {
  CreatePostWithBlogIdInputModel,
  PostParams,
  QuerySortedPostsType,
} from '../types/post/input';
import { QueryPostOutputModel } from '../types/post/output';
import { PostSortData } from '../utils/SortData';
import { PostQueryRepository } from '../repositories/post/post.query.repository';
import { ApiError } from '../exeptions/api.error';
import { ResponseStatusCodesEnum } from '../utils/constants';
import { PostService } from '../domain/post.service';

export class PostController {
  static async getAll(
    request: QueryRequestType<{}, QuerySortedPostsType>,
    response: ResponseWithPagination<QueryPostOutputModel>,
    next: NextFunction
  ) {
    try {
      const sortData = new PostSortData(request.query);

      const posts = await PostQueryRepository.getAll(sortData);

      response.send(posts);
    } catch (error) {
      next(error);
    }
  }

  static async getById(
    request: RequestType<PostParams, {}>,
    response: Response,
    next: NextFunction
  ) {
    try {
      const findedPost = await PostQueryRepository.getById(request.params.id);

      if (!findedPost) {
        throw new ApiError(ResponseStatusCodesEnum.NotFound, 'Пост с указанныи id не найден');
      }

      response.send(findedPost);
    } catch (error) {
      next(error);
    }
  }

  static async post(
    request: RequestType<{}, CreatePostWithBlogIdInputModel>,
    response: Response,
    next: NextFunction
  ) {
    try {
      const createdPost = await PostService.createPost(request.body);

      if (!createdPost) {
        throw new ApiError(ResponseStatusCodesEnum.BadRequest, `Не удалось создать пост`);
      }

      response.status(ResponseStatusCodesEnum.Created).send(createdPost);
    } catch (error) {
      next(error);
    }
  }

  static async put(
    request: RequestType<PostParams, CreatePostWithBlogIdInputModel>,
    response: Response,
    next: NextFunction
  ) {
    try {
      const isPostUpdated = await PostService.updatePost(request.params.id, request.body);

      if (!isPostUpdated) {
        throw new ApiError(ResponseStatusCodesEnum.NotFound, `Некорректный id блога или id поста`);
      }

      response.sendStatus(ResponseStatusCodesEnum.NoContent);
    } catch (error) {
      next(error);
    }
  }

  static async delete(
    request: RequestType<PostParams, CreatePostWithBlogIdInputModel>,
    response: Response,
    next: NextFunction
  ) {
    try {
      const isPostDeleted = await PostService.deletePostById(request.params.id);

      if (!isPostDeleted) {
        throw new ApiError(
          ResponseStatusCodesEnum.NotFound,
          `Пост с id = ${request.params.id} не найден`
        );
      }

      response.sendStatus(ResponseStatusCodesEnum.NoContent);
    } catch (error) {
      next(error);
    }
  }
}
