import { type NextFunction, type Response } from 'express';

import {
  type QueryRequestType,
  type RequestType,
  type ResponseWithPagination,
} from '../types/common';
import {
  type CreatePostWithBlogIdInputModel,
  type PostParams,
  type QuerySortedPostsType,
} from '../types/post/input';
import { type QueryPostOutputModel } from '../types/post/output';
import { PostSortData } from '../utils/SortData';
import { type PostQueryRepository } from '../repositories/post/post.query.repository';
import { ApiError } from '../exeptions/api.error';
import { ResponseStatusCodesEnum } from '../utils/constants';
import { type PostService } from '../domain/post.service';
import { type LikeService } from '../domain/like.service';
import { type UpdateLikeInfoType } from '../types/comment/input';

export class PostController {
  constructor(
    protected postQueryRepository: PostQueryRepository,
    protected postService: PostService,
    protected likeService: LikeService,
  ) {}

  async getAll(
    request: QueryRequestType<{}, QuerySortedPostsType>,
    response: ResponseWithPagination<QueryPostOutputModel>,
    next: NextFunction,
  ) {
    try {
      const sortData = new PostSortData(request.query);
      const userId = request.userId;
      const posts = await this.postQueryRepository.getAll(sortData, userId);

      response.send(posts);
    } catch (error) {
      next(error);
    }
  }

  async getById(request: RequestType<PostParams, {}>, response: Response, next: NextFunction) {
    try {
      const userId = request.userId;
      const findedPost = await this.postQueryRepository.getById(request.params.id, userId);

      if (!findedPost) {
        throw new ApiError(ResponseStatusCodesEnum.NotFound, 'Пост с указанныи id не найден');
      }

      response.send(findedPost);
    } catch (error) {
      next(error);
    }
  }

  async post(
    request: RequestType<{}, CreatePostWithBlogIdInputModel>,
    response: Response,
    next: NextFunction,
  ) {
    try {
      const createdPost = await this.postService.createPost(request.body);

      if (!createdPost) {
        throw new ApiError(ResponseStatusCodesEnum.BadRequest, 'Не удалось создать пост');
      }

      response.status(ResponseStatusCodesEnum.Created).send(createdPost);
    } catch (error) {
      next(error);
    }
  }

  async put(
    request: RequestType<PostParams, CreatePostWithBlogIdInputModel>,
    response: Response,
    next: NextFunction,
  ) {
    try {
      const isPostUpdated = await this.postService.updatePost(request.params.id, request.body);

      if (!isPostUpdated) {
        throw new ApiError(ResponseStatusCodesEnum.NotFound, 'Некорректный id блога или id поста');
      }

      response.sendStatus(ResponseStatusCodesEnum.NoContent);
    } catch (error) {
      next(error);
    }
  }

  async delete(
    request: RequestType<PostParams, CreatePostWithBlogIdInputModel>,
    response: Response,
    next: NextFunction,
  ) {
    try {
      const isPostDeleted = await this.postService.deletePostById(request.params.id);

      if (!isPostDeleted) {
        throw new ApiError(
          ResponseStatusCodesEnum.NotFound,
          `Пост с id = ${request.params.id} не найден`,
        );
      }

      response.sendStatus(ResponseStatusCodesEnum.NoContent);
    } catch (error) {
      next(error);
    }
  }

  async putLikeForPost(
    request: RequestType<PostParams, UpdateLikeInfoType>,
    response: Response,
    next: NextFunction,
  ) {
    try {
      const postId = request.params.id;
      const userId = request.userId;
      const likeStatus = request.body.likeStatus;

      if (!userId) {
        throw ApiError.UnauthorizedError();
      }

      const result = await this.likeService.createOrUpdateLike(
        postId,
        userId,
        likeStatus,
        'post',
      );

      if (result) {
        response.sendStatus(ResponseStatusCodesEnum.NoContent);
      } else {
        next(
          new ApiError(ResponseStatusCodesEnum.InternalError, 'Не удалось обновить комментарий'),
        );
      }
    } catch (error) {
      console.error(error);

      next(error);
    }
  }
}
