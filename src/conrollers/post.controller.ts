import { NextFunction, Response } from 'express';

import { QueryRequestType, RequestType, ResponseWithPagination } from '../types/common';
import { PostParams, QuerySortedPostsType } from '../types/post/input';
import { QueryPostOutputModel } from '../types/post/output';
import { PostSortData } from '../utils/SortData';
import { PostQueryRepository } from '../repositories/post/post.query.repository';
import { ApiError } from '../exeptions/api.error';
import { ResponseStatusCodesEnum } from '../utils/constants';

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
}
