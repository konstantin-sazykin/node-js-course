import { ObjectId } from 'mongodb';

import { blogCollection } from '../db/db';
import { CreateBlogInputModel, UpdateBlogInputModel } from '../types/blog/input';
import { QueryBlogOutputModel } from '../types/blog/output';
import { BlogMapper } from '../types/blog/mapper';

export class BlogsRepository {
  static async getAllBlogs(): Promise<QueryBlogOutputModel[]> {
    const blogs = await blogCollection.find({}).toArray();

    return blogs.map((blog) => ({ ...new BlogMapper(blog) }));
  }

  static async getBlogById(id: string) {
    const blog = await blogCollection.findOne({ _id: new ObjectId(id) });

    if (!blog) {
      return null;
    }

    return { ...new BlogMapper(blog) };
  }

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
        } else {
          return null;
        }
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
        { $set: { ...data } }
      );

      return !!result.modifiedCount;
    } catch (error) {
      return false;
    }
  }

  static async deleteBlog(id: string): Promise<Boolean> {
    try {
      const result = await blogCollection.deleteOne({ _id: new ObjectId(id) });

      return !!result.deletedCount;
    } catch (error) {
      return false;
    }
  }
}
