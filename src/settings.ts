import express from 'express';

import { videoRoute } from './routes/video.route';
import { blogRoute } from './routes/blog.route';

export const app = express();

app.use(express.json());

app.use(`/videos`, videoRoute);
app.use('/blogs', blogRoute);

