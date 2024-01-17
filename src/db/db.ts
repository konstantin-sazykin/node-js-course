import { MongoClient } from 'mongodb';
import colors from 'colors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import { type PostType } from '../types/post/output';
import { type UserType } from '../types/user/output';
import { type SessionType } from '../types/session/output';
import { type AttemptType } from '../types/attempt/output';
import { MongoCollections } from '../utils/constants';

dotenv.config();

const mongoUrl = process.env.MONGO_URL;
const dbName = process.env.DB_NAME ?? 'node-js-backend-course';

if (!mongoUrl) {
  throw new Error('mongoUrl is undefined');
}

const client = new MongoClient(mongoUrl);

const db = client.db(dbName);

export const postCollection = db.collection<PostType>(MongoCollections.posts);
export const userCollection = db.collection<UserType>(MongoCollections.users);
export const sessionCollection = db.collection<SessionType>(MongoCollections.sessions);
export const attemptCollection = db.collection<AttemptType>(MongoCollections.attempts);

export const launchDb = async (): Promise<void> => {
  try {
    await client.connect();
    await mongoose.connect(mongoUrl, { dbName });

    console.log(colors.green(`Client connected to DB with URL ${mongoUrl}`));
  } catch (error) {
    if (error) {
      console.log(colors.red(String(error)));
    }

    await client.close();
    await mongoose.disconnect();
  }
};

export const closeDbConnection = async (): Promise<void> => {
  await client.close();
  await mongoose.disconnect();
};
