import { type NextFunction, type Response } from 'express';

import { ApiError } from '../../exeptions/api.error';
import { type RequestType } from '../../types/common';
import { type CommentsParams, type UpdateCommentType } from '../../types/comment/input';
import { ResponseStatusCodesEnum } from '../../utils/constants';
import { commentQueryRepository } from '../../composition-root';

const errorText = 'It is impossible to change someone else`s comment';

export const commentAuthorMiddleware = async (
  request: RequestType<CommentsParams, UpdateCommentType>,
  response: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = request.userId;
    const commentId = request.params.id;
    const comment = await commentQueryRepository.find(commentId);

    if (comment?.commentatorId !== userId) {
      next(
        new ApiError(
          ResponseStatusCodesEnum.Forbidden,
          errorText,
        ),
      );

      return;
    }

    next();
  } catch (error) {
    console.error(error);

    next(new ApiError(ResponseStatusCodesEnum.Forbidden, errorText));
  }
};
