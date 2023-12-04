import { type Response, Router, NextFunction } from 'express';
import { CreatePostWithBlogIdInputModel, PostParams, QuerySortedPostsType } from '../types/post/input';
import { QueryRequestType, RequestType, ResponseWithPagination } from '../types/common';
import { ResponseStatusCodesEnum } from '../utils/constants';
import { ApiError } from '../exeptions/api.error';
import { authMiddleware } from '../middlewares/auth/auth.middleware';
import { postWithBlogIdCreateValidation } from '../validators/post.validator';
import { paramValidation } from '../validators/common';
import { PostQueryRepository } from '../repositories/post/post.query.repository';
import { QueryPostOutputModel } from '../types/post/output';
import { PostSortData } from '../utils/SortData';
import { PostService } from '../domain/post.service';

export const postsRouter = Router();

postsRouter.get('/', async (request: QueryRequestType<{}, QuerySortedPostsType>, response: ResponseWithPagination<QueryPostOutputModel>, next: NextFunction) => {
  try {
    const sortData = new PostSortData(request.query);

    const posts = await PostQueryRepository.getAll(sortData);

    response.send(posts);
  } catch (error) {
    next(error);
  }
});

postsRouter.get(
  '/:id',
  paramValidation(),
  async (request: RequestType<PostParams, {}>, response: Response, next: NextFunction) => {
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
);

postsRouter.post(
  '/',
  authMiddleware,
  postWithBlogIdCreateValidation(),
  async (
    request: RequestType<{}, CreatePostWithBlogIdInputModel>,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const createdPost = await PostService.createPost(request.body);

      if (!createdPost) {
        throw new ApiError(
          ResponseStatusCodesEnum.BadRequest,
          `Не удалось создать пост`
        );
      }

      response.status(ResponseStatusCodesEnum.Created).send(createdPost);
    } catch (error) {
      next(error);
    }
  }
);

postsRouter.put(
  '/:id',
  authMiddleware,
  paramValidation(),
  postWithBlogIdCreateValidation(),
  async (
    request: RequestType<PostParams, CreatePostWithBlogIdInputModel>,
    response: Response,
    next: NextFunction
  ) => {
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
);

postsRouter.delete(
  '/:id',
  authMiddleware,
  paramValidation(),
  async (
    request: RequestType<PostParams, CreatePostWithBlogIdInputModel>,
    response: Response,
    next: NextFunction
  ) => {
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
);
