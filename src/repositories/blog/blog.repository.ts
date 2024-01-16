import { ObjectId } from 'mongodb';

import { type CreateBlogInputModel, type UpdateBlogInputModel } from '../../types/blog/input';
import { type QueryBlogOutputModel } from '../../types/blog/output';
import { BlogMapper } from '../../types/blog/mapper';
import { BlogModel } from '../../models/blog.model';

export class BlogRepository {
  static async createBlog(data: CreateBlogInputModel): Promise<QueryBlogOutputModel | null> {
    try {
      const result = await BlogModel.create({
        name: data.name,
        description: data.description,
        websiteUrl: data.websiteUrl,
        createdAt: new Date().toISOString(),
        isMembership: false,
      });

      return { ...new BlogMapper(result) };
    } catch (error) {
      console.error(error);

      return null;
    }
  }

  static async updateBlog(id: string, data: UpdateBlogInputModel): Promise<boolean> {
    try {
      const result = await BlogModel.updateOne(
        { _id: new ObjectId(id) },
        { name: data.name, description: data.description, websiteUrl: data.websiteUrl },
      );

      return !!result.modifiedCount;
    } catch (error) {
      return false;
    }
  }

  static async deleteBlog(id: string): Promise<boolean> {
    try {
      const result = await BlogModel.deleteOne({ _id: new ObjectId(id) });

      return !!result.deletedCount;
    } catch (error) {
      return false;
    }
  }
}
