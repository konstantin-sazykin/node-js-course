import Mongoose, { Schema } from 'mongoose';

import { MongoCollections } from '../utils/constants';
import { type CommentType, type LikesInfoType } from '../types/comment/output';

const likeSchema = new Schema<LikesInfoType>({
  status: { type: String },
  userId: { type: String, ref: 'User' },
});

const CommentSchema = new Schema<CommentType>({
  commentatorId: { type: String },
  content: { type: String },
  createdAt: { type: Date },
  postId: { type: String, ref: 'Post' },
  likes: [likeSchema],
});

export const CommentModel = Mongoose.model<CommentType>(MongoCollections.comments, CommentSchema);
