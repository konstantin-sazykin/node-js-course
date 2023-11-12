import express from 'express';
import { router } from './router';
import dotenv from 'dotenv';

export const app = express();

dotenv.config()

console.log(`${process.env.BASE_PATH}/api`);


app.use(express.json());
app.use(`${process.env.BASE_PATH}/api`, router);

