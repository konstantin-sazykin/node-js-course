import { MongoClient } from 'mongodb';
import colors from 'colors';
import dotenv from 'dotenv';

import { type BlogType } from '../types/blog/output';
import { type PostType } from '../types/post/output';
import { type UserType } from '../types/user/output';
import { type CommentType } from '../types/comment/output';
import { type SessionType } from '../types/session/output';

dotenv.config();

const mongoUrl = process.env.MONGO_URL;

if (!mongoUrl) {
  throw new Error('mongoUrl is undefined');
}

const client = new MongoClient(mongoUrl);

const db = client.db('node-js-backend-course');

export const blogCollection = db.collection<BlogType>('blog');
export const postCollection = db.collection<PostType>('post');
export const userCollection = db.collection<UserType>('user');
export const commentCollection = db.collection<CommentType>('comment');
export const sessionCollection = db.collection<SessionType>('session');

export const launchDb = async (): Promise<void> => {
  try {
    await client.connect();

    console.log(colors.green(`Client connected to DB with URL ${mongoUrl}`));
  } catch (error) {
    if (error) {
      console.log(colors.red(String(error)));
    }

    await client.close();
  }
};

export const closeDbConnection = async (): Promise<void> => {
  await client.close();
};
