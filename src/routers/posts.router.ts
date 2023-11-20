import { type Request, type Response, Router } from 'express';
import { PostRepository } from '../repositories/post.repository';
import { PostDTO } from '../dto/post.dto';
import { CreatePostInputModel, PostParams } from '../types/post/input';
import { RequestType } from '../types/common';
import { ResponseStatusCodesEnum } from '../utils/constants';
import { ApiError } from '../exeptions/api.error';
import { authMiddleware } from '../middlewares/auth/auth.middleware';
import { postCreateValidation } from '../validators/post.validator';

export const postsRouter = Router();

postsRouter.get('/', (request: Request, response: Response) => {
  const allPosts = PostRepository.getAllPosts();

  response.send(allPosts.map((post) => ({ ...new PostDTO(post) })));
});

postsRouter.get('/:id', (request: RequestType<PostParams, {}>, response: Response) => {
  const findedPost = PostRepository.findPostsById(request.params.id);

  if (findedPost) {
    return response.send({ ...new PostDTO(findedPost) });
  } else {
    throw new ApiError(ResponseStatusCodesEnum.NotFound, 'Пост с указанныи id не найден');
  }
});

postsRouter.post(
  '/',
  authMiddleware,
  postCreateValidation(),
  (request: RequestType<{}, CreatePostInputModel>, response: Response) => {
    const createdPost = PostRepository.createPost(request.body);

    if (createdPost) {
      return response.status(ResponseStatusCodesEnum.Created).send({ ...new PostDTO(createdPost) });
    } else {
      throw new ApiError(
        ResponseStatusCodesEnum.BadRequest,
        `Не удалось найти блог с id ${request.body.blogId}`
      );
    }
  }
);

postsRouter.put(
  '/:id',
  authMiddleware,
  postCreateValidation(),
  (request: RequestType<PostParams, CreatePostInputModel>, response: Response) => {
    const updatedPost = PostRepository.updatePost(request.body, request.params.id);

    if (!updatedPost) {
      throw new ApiError(ResponseStatusCodesEnum.BadRequest, `Некорректный id блога или id поста`);
    }

    response.sendStatus(ResponseStatusCodesEnum.NoContent);
  }
);

postsRouter.delete(
  '/:id',
  authMiddleware,
  (request: RequestType<PostParams, CreatePostInputModel>, response: Response) => {
    const isPostDeleted = PostRepository.deletePost(request.params.id);

    if (!isPostDeleted) {
      throw new ApiError(
        ResponseStatusCodesEnum.NotFound,
        `Пост с id = ${request.params.id} не найден`
      );
    }

    response.sendStatus(ResponseStatusCodesEnum.NoContent);
  }
);
