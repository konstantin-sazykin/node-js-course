import express from 'express';

import { videosRouter } from 'src/routers/videos.router';
import { blogsRouter } from 'src/routers/blogs.router';
import { postsRouter } from 'src/routers/posts.router';
import { errorMiddleware } from 'src/middlewares/error/error.middleware';
import { testingRouter } from 'src/routers/testing.router';
import { RoutesPathsEnum } from 'src/utils/constants';

export const app = express();

app.use(express.json());

app.use(RoutesPathsEnum.videos, videosRouter);
app.use(RoutesPathsEnum.blogs, blogsRouter);
app.use(RoutesPathsEnum.posts, postsRouter);
app.use(RoutesPathsEnum.testingAllData, testingRouter);
app.use(errorMiddleware);
