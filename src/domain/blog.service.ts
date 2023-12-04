import { BlogRepository } from '../repositories/blog/blog.repository';
import { CreateBlogInputModel, UpdateBlogInputModel } from '../types/blog/input';

export class BlogService {
  static async createBlog(data: CreateBlogInputModel) {
    const createdBlog = await BlogRepository.createBlog(data);

    if (!createdBlog) {
      return null;
    }

    return createdBlog;
  }

  static async updateBlog(id: string, data: UpdateBlogInputModel): Promise<boolean> {
    const isUpdated = await BlogRepository.updateBlog(id, data);

    return isUpdated;
  }

  static async deleteBlog(id: string): Promise<boolean> {
    const isDeleted = await BlogRepository.deleteBlog(id);

    return isDeleted;
  }
}
