import express from 'express';
import cookieParser from 'cookie-parser';

import { RoutesPathsEnum } from './utils/constants';
import { videosRouter } from './routers/videos.router';
import { blogsRouter } from './routers/blogs.router';
import { testingRouter } from './routers/testing.router';
import { postsRouter } from './routers/posts.router';
import { errorMiddleware } from './middlewares/error/error.middleware';
import { authRouter } from './routers/auth.router';
import { userRouter } from './routers/user.router';
import { commentRouter } from './routers/comment.router';
import { sessionRouter } from './routers/session.router';

export const app = express();

app.use(cookieParser());
app.use(express.json());
app.set('trust proxy', true);

app.use(RoutesPathsEnum.videos, videosRouter);
app.use(RoutesPathsEnum.blogs, blogsRouter);
app.use(RoutesPathsEnum.posts, postsRouter);
app.use(RoutesPathsEnum.testingAllData, testingRouter);
app.use(RoutesPathsEnum.auth, authRouter);
app.use(RoutesPathsEnum.user, userRouter);
app.use(RoutesPathsEnum.comments, commentRouter);
app.use(RoutesPathsEnum.devices, sessionRouter);

app.use(errorMiddleware);
