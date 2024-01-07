import { ObjectId } from 'mongodb';

import { blogCollection } from '../../db/db';
import { type CreateBlogInputModel, type UpdateBlogInputModel } from '../../types/blog/input';
import { type QueryBlogOutputModel } from '../../types/blog/output';
import { BlogMapper } from '../../types/blog/mapper';

export class BlogRepository {
  static async createBlog(data: CreateBlogInputModel): Promise<QueryBlogOutputModel | null> {
    try {
      const result = await blogCollection.insertOne({
        ...data,
        createdAt: new Date().toISOString(),
        isMembership: false,
      });

      if (result.acknowledged) {
        const createdBlog = await blogCollection.findOne({ _id: result.insertedId });

        if (createdBlog) {
          return { ...new BlogMapper(createdBlog) };
        }
        return null;
      }

      return null;
    } catch (error) {
      return null;
    }
  }

  static async updateBlog(id: string, data: UpdateBlogInputModel): Promise<boolean> {
    try {
      const result = await blogCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { ...data } },
      );

      return !!result.modifiedCount;
    } catch (error) {
      return false;
    }
  }

  static async deleteBlog(id: string): Promise<boolean> {
    try {
      const result = await blogCollection.deleteOne({ _id: new ObjectId(id) });

      return !!result.deletedCount;
    } catch (error) {
      return false;
    }
  }
}
