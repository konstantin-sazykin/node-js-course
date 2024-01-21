import dotenv from 'dotenv';

import { AuthController } from './conrollers/auth.controller';
import { CommentController } from './conrollers/comment.controller';
import { UserController } from './conrollers/user.controller';
import { CommentService } from './domain/comment.service';
import { UserService } from './domain/user.service';
import { CommentQueryRepository } from './repositories/comment/comment.query-repository';
import { CommentRepository } from './repositories/comment/comment.repository';
import { UserQueryRepository } from './repositories/user/user.query-repository';
import { UserRepository } from './repositories/user/user.repository';
import { LikeQueryRepository } from './repositories/like/like.query-repository';
import { LikeService } from './domain/like.service';
import { LikeRepository } from './repositories/like/like.repository';
import { PostController } from './conrollers/post.controller';
import { PostQueryRepository } from './repositories/post/post.query.repository';
import { PostService } from './domain/post.service';
import { BlogQueryRepository } from './repositories/blog/blog.query-repository';
import { BlogController } from './conrollers/blog.controller';

dotenv.config();

const ACCESS_TOKEN_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRES_IN ?? '10s';

export const userRepository = new UserRepository();
const userQueryRepository = new UserQueryRepository();
const userService = new UserService(userRepository);

export const userController = new UserController(userService, userQueryRepository);

const likeQueryRepository = new LikeQueryRepository();
const likeRepository = new LikeRepository();
const likeService = new LikeService(likeRepository);

const commentRepository = new CommentRepository();
export const commentQueryRepository = new CommentQueryRepository();
const commentService = new CommentService(
  userQueryRepository,
  commentRepository,
  commentQueryRepository,
  likeQueryRepository,
);

export const commentController = new CommentController(commentService, likeService);

export const blogQueryRepository = new BlogQueryRepository();

export const authController = new AuthController(
  userService,
  userQueryRepository,
  ACCESS_TOKEN_EXPIRES_IN,
);

export const postQueryRepository = new PostQueryRepository();
const postService = new PostService(blogQueryRepository, postQueryRepository, likeQueryRepository);

export const postController = new PostController(postQueryRepository, postService, likeService);
export const blogController = new BlogController(blogQueryRepository, postService, postQueryRepository);
