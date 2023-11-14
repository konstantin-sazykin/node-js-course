import express from 'express';

import { videoRoute } from './routes/video.route';

export const app = express();

app.use(express.json());

app.use(`/videos`, videoRoute);
