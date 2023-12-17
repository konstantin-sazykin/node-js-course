import { NextFunction, Request, Response } from 'express';
import { ApiError } from '../../exeptions/api.error';
import { RequestType } from '../../types/common';
import { CommentsParams, UpdateCommentType } from '../../types/comment/input';
import { CommentQueryRepository } from '../../repositories/comment/comment.query-repository';
import { ResponseStatusCodesEnum } from '../../utils/constants';

const errorText = 'It is impossible to change someone else`s comment';

export const commentAuthorMiddleware = async (
  request: RequestType<CommentsParams, UpdateCommentType>,
  response: Response,
  next: NextFunction
) => {
  try {
    const userId = request.userId;
    const commentId = request.params.id;
    const comment = await CommentQueryRepository.find(commentId);


    if (comment?.commentatorId !== userId) {
      next(
        new ApiError(
          ResponseStatusCodesEnum.Forbidden,
          errorText,
        )
      );

      return;
    }

    next();
  } catch (error) {
    console.log(error);
    
    next(new ApiError(ResponseStatusCodesEnum.Forbidden, errorText));
  }
};
