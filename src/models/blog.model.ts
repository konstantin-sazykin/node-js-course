import Mongoose, { Schema } from 'mongoose';

import { type BlogType } from '../types/blog/output';
import { MongoCollections } from '../utils/constants';

const BlogSchema = new Schema<BlogType>({
  name: { type: String },
  description: { type: String },
  websiteUrl: { type: String },
  createdAt: { type: String },
  isMembership: { type: Boolean },
});

export const BlogModel = Mongoose.model<BlogType>(MongoCollections.blogs, BlogSchema);
