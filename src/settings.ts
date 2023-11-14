import express from 'express';

import { videoRoute } from './routes/video.route';
import { blogRoute } from './routes/blog.route';
import { postRoute } from './routes/post.route';
import { authMiddleware } from './middlewares/auth/auth.middleware';
import { errorMiddleware } from './middlewares/error/error.middleware';

export const app = express();

app.use(express.json());

app.use(`/videos`, videoRoute);
app.use('/blogs', authMiddleware, blogRoute);
app.use('/posts', authMiddleware, postRoute);
app.use(errorMiddleware);