import Mongoose, { Schema } from 'mongoose';

import { MongoCollections } from '../utils/constants';
import { type LikeType } from '../types/like/output';

const LikeSchema = new Schema<LikeType>({
  status: { type: String },
  userId: { type: String },
  commentId: { type: String },
  postId: { type: String },
});

export const LikeModel = Mongoose.model<LikeType>(MongoCollections.likes, LikeSchema);
