import express from 'express';
import { RoutesPathsEnum } from './utils/constants';
import { videosRouter } from './routers/videos.router';
import { blogsRouter } from './routers/blogs.router';
import { testingRouter } from './routers/testing.router';
import { postsRouter } from './routers/posts.router';
import { errorMiddleware } from './middlewares/error/error.middleware';

export const app = express();

app.use(express.json());

app.use(RoutesPathsEnum.videos, videosRouter);
app.use(RoutesPathsEnum.blogs, blogsRouter);
app.use(RoutesPathsEnum.posts, postsRouter);
app.use(RoutesPathsEnum.testingAllData, testingRouter);
app.use(errorMiddleware);
