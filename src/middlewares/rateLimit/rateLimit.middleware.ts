import { type NextFunction, type Response } from 'express';

import { type CommentsParams, type UpdateCommentType } from '../../types/comment/input';
import { type RequestType } from '../../types/common';
import { ApiError } from '../../exeptions/api.error';
import { ResponseStatusCodesEnum } from '../../utils/constants';
import { RateLimitService } from '../../domain/rateLimit.service';

const RATE_LIMIT_POINTS = 6;
const RATE_LIMIT_DURATION = 10 * 1000;

export const rateLimitMiddleware = async (
  request: RequestType<CommentsParams, UpdateCommentType>,
  response: Response,
  next: NextFunction,
): Promise<void> => {
  const IP = request.ip;

  if (!IP) {
    throw ApiError.BadRequest(null, 'Unable to get an IP address from the request');
  }
  try {
    const res = await RateLimitService.checkLimit(IP, RATE_LIMIT_POINTS, RATE_LIMIT_DURATION);

    if (!res) {
      throw new ApiError(ResponseStatusCodesEnum.TooManyRequests, 'Too many requests');
    }

    next();
  } catch (error) {
    next(error);
  }
};