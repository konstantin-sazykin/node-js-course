import { NextFunction, Response } from 'express';
import {
  CommentsParams,
  CreateCommentType,
  QuerySortedCommentsType,
  UpdateCommentType,
} from '../types/comment/input';
import { QueryRequestType, RequestType } from '../types/common';
import { CommentSortData } from '../utils/SortData';
import { CommentService } from '../domain/comment.service';
import { ApiError } from '../exeptions/api.error';
import { ResponseStatusCodesEnum } from '../utils/constants';

export class CommentController {
  static async getCommentsByPostId(
    request: QueryRequestType<CommentsParams, QuerySortedCommentsType>,
    response: Response,
    next: NextFunction
  ) {
    try {
      const postId = request.params.id;
      const sortData = new CommentSortData(request.query);

      const result = await CommentService.findCommentsForPost(postId, sortData);

      response.send(result);
    } catch (error) {
      next(error);
    }
  }

  static async postCommentByPostId(
    request: RequestType<CommentsParams, CreateCommentType>,
    response: Response,
    next: NextFunction
  ) {
    try {
      const postId = request.params.id;
      const userId = request.userId;
      const content = request.body.content;

      if (!userId) {
        return next(ApiError.BadRequest(null, `Can not create comment with user id ${userId}`));
      }

      const result = await CommentService.createComment(postId, userId, content);

      response.status(ResponseStatusCodesEnum.Created).send(result);
    } catch (error) {
      next(error);
    }
  }

  static async getById(
    request: RequestType<CommentsParams, {}>,
    response: Response,
    next: NextFunction
  ) {
    try {
      const commentId = request.params.id;
      const result = await CommentService.getComment(commentId);

      if (result) {
        response.send(result);
      } else {
        next(new ApiError(ResponseStatusCodesEnum.NotFound, ''));
      }
    } catch (error) {
      next(error);
    }
  }

  static async put(
    request: RequestType<CommentsParams, UpdateCommentType>,
    response: Response,
    next: NextFunction
  ) {
    try {
      const commentId = request.params.id;
      const content = request.body.content;

      const result = await CommentService.update(commentId, content);

      if (result) {
        response.sendStatus(ResponseStatusCodesEnum.NoContent);
      } else {
        next(
          new ApiError(ResponseStatusCodesEnum.InternalError, 'Не удалось обновить комментарий')
        );
      }
    } catch (error) {
      next(error);
    }
  }

  static async delete(
    request: RequestType<CommentsParams, {}>,
    response: Response,
    next: NextFunction
  ) {
    try {
      const commentId = request.params.id;

      const result = await CommentService.delete(commentId);

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
