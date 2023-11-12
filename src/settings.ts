import express from 'express';
import { router } from './router';
import dotenv from 'dotenv';

export const app = express();

dotenv.config()

app.use(express.json());
// app.use(`${process.env.BASE_PATH}/api`, router);
app.use(`/`, router);

