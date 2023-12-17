import { MongoClient } from 'mongodb';
import colors from 'colors';
import dotenv from 'dotenv';

import { BlogType } from '../types/blog/output';
import { PostType } from '../types/post/output';
import { UserType } from '../types/user/output';
import { CommentType } from '../types/comment/output';

dotenv.config();

const mongoUrl = process.env.MONGO_URL;

const client = new MongoClient(mongoUrl!);

const db = client.db('node-js-backend-course');

export const blogCollection = db.collection<BlogType>('blog');
export const postCollection = db.collection<PostType>('post');
export const userCollection = db.collection<UserType>('user');
export const commentCollection = db.collection<CommentType>('comment');


export const launchDb = async () => {
  try {
    await client.connect();

    console.log(colors.green(`Client connected to DB with URL ${mongoUrl}`));
    
  } catch (error) {
    if (error) {
      console.log(colors.red(String(error)));
    }

    await client.close();
  }
}

export const closeDbConnection = async () => {
  await client.close();
};