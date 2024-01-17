import { AuthController } from './conrollers/auth.controller';
import { CommentController } from './conrollers/comment.controller';
import { UserController } from './conrollers/user.controller';
import { CommentService } from './domain/comment.service';
import { UserService } from './domain/user.service';
import { CommentQueryRepository } from './repositories/comment/comment.query-repository';
import { CommentRepository } from './repositories/comment/comment.repository';
import { UserQueryRepository } from './repositories/user/user.query-repository';
import { UserRepository } from './repositories/user/user.repository';

export const userRepository = new UserRepository();
const userQueryRepository = new UserQueryRepository();
const userService = new UserService(userRepository);

export const userController = new UserController(userService, userQueryRepository);


const commentRepository = new CommentRepository();
export const commentQueryRepository = new CommentQueryRepository();
const commentService = new CommentService(userQueryRepository, commentRepository, commentQueryRepository);

export const commentController = new CommentController(commentService);

export const authController = new AuthController(userService, userQueryRepository);