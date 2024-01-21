import Mongoose, { Schema } from 'mongoose';

import { MongoCollections } from '../utils/constants';
import { type CommentType } from '../types/comment/output';

const CommentSchema = new Schema<CommentType>({
  commentatorId: { type: String },
  content: { type: String },
  createdAt: { type: Date },
  postId: { type: String, ref: 'Post' },
});

export const CommentModel = Mongoose.model<CommentType>(MongoCollections.comments, CommentSchema);
