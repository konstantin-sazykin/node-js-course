import { type Request, type Response, Router, NextFunction } from 'express';
import { PostRepository } from '../repositories/post.repository';
import { CreatePostInputModel, PostParams } from '../types/post/input';
import { RequestType } from '../types/common';
import { ResponseStatusCodesEnum } from '../utils/constants';
import { ApiError } from '../exeptions/api.error';
import { authMiddleware } from '../middlewares/auth/auth.middleware';
import { postCreateValidation } from '../validators/post.validator';
import { paramValidation } from '../validators/common';

export const postsRouter = Router();

postsRouter.get('/', async (request: Request, response: Response, next: NextFunction) => {
  try {
    const posts = await PostRepository.getAllPosts();

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
      const findedPost = await PostRepository.findPostsById(request.params.id);

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
  postCreateValidation(),
  async (
    request: RequestType<{}, CreatePostInputModel>,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const createdPost = await PostRepository.createPost(request.body);

      if (!createdPost) {
        throw new ApiError(
          ResponseStatusCodesEnum.BadRequest,
          `Не удалось найти блог с id ${request.body.blogId}`
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
  postCreateValidation(),
  async (
    request: RequestType<PostParams, CreatePostInputModel>,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const isPostUpdated = await PostRepository.updatePost(request.body, request.params.id);

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
    request: RequestType<PostParams, CreatePostInputModel>,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const isPostDeleted = await PostRepository.deletePost(request.params.id);

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
