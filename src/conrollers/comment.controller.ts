import { type NextFunction, type Response } from 'express';

import {
  type CommentsParams,
  type CreateCommentType,
  type QuerySortedCommentsType,
  type UpdateCommentType,
} from '../types/comment/input';
import { type QueryRequestType, type RequestType } from '../types/common';
import { CommentSortData } from '../utils/SortData';
import { ApiError } from '../exeptions/api.error';
import { ResponseStatusCodesEnum } from '../utils/constants';
import { CommentService } from '../domain/comment.service';

export class CommentController {
  constructor(protected commentService: CommentService) {};
  async getCommentsByPostId(
    request: QueryRequestType<CommentsParams, QuerySortedCommentsType>,
    response: Response,
    next: NextFunction,
  ) {
    try {
      const postId = request.params.id;
      const sortData = new CommentSortData(request.query);

      const result = await this.commentService.findCommentsForPost(postId, sortData);

      response.send(result);
    } catch (error) {
      next(error);
    }
  }

  async postCommentByPostId(
    request: RequestType<CommentsParams, CreateCommentType>,
    response: Response,
    next: NextFunction,
  ) {
    try {
      const postId = request.params.id;
      const userId = request.userId;
      const content = request.body.content;

      if (!userId) {
        next(ApiError.BadRequest(null, `Can not create comment with user id ${userId}`)); return;
      }

      const result = await this.commentService.createComment(postId, userId, content);

      response.status(ResponseStatusCodesEnum.Created).send(result);
    } catch (error) {
      next(error);
    }
  }

  async getById(
    request: RequestType<CommentsParams, {}>,
    response: Response,
    next: NextFunction,
  ) {
    try {
      const commentId = request.params.id;
      const result = await this.commentService.getComment(commentId);

      if (result) {
        response.send(result);
      } else {
        next(new ApiError(ResponseStatusCodesEnum.NotFound, ''));
      }
    } catch (error) {
      next(error);
    }
  }

  async put(
    request: RequestType<CommentsParams, UpdateCommentType>,
    response: Response,
    next: NextFunction,
  ) {
    try {
      const commentId = request.params.id;
      const content = request.body.content;

      const result = await this.commentService.update(commentId, content);

      if (result) {
        response.sendStatus(ResponseStatusCodesEnum.NoContent);
      } else {
        next(
          new ApiError(ResponseStatusCodesEnum.InternalError, 'Не удалось обновить комментарий'),
        );
      }
    } catch (error) {
      next(error);
    }
  }

  async delete(
    request: RequestType<CommentsParams, {}>,
    response: Response,
    next: NextFunction,
  ) {
    try {
      const commentId = request.params.id;

      const result = await this.commentService.delete(commentId);

      if (result) {
        response.sendStatus(ResponseStatusCodesEnum.NoContent);
      } else {
        next(new ApiError(ResponseStatusCodesEnum.InternalError, 'Не удалось удалить комментарий'));
      }
    } catch (error) {
      next(error);
    }
  }
}
