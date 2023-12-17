import { NextFunction, Response } from 'express';
import { CommentsParams, CreateCommentType, QuerySortedCommentsType } from '../types/comment/input';
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
}
