import { PostRepository } from '../repositories/post/post.repository';
import { CreatePostInputModel, UpdatePostInputModel } from '../types/post/input';
import { QueryPostOutputModel } from '../types/post/output';

export class PostService {
  static async createPost(data: CreatePostInputModel): Promise<QueryPostOutputModel | null> {
    const createdBlog = await PostRepository.create(data);

    return createdBlog;
  }

  static async updatePost(id: string, data: UpdatePostInputModel): Promise<boolean> {
    const isUpdated = await PostRepository.update(data, id);

    return isUpdated;
  }

  static async deletePostById(id: string): Promise<boolean> {
    const isDeleted = await PostRepository.delete(id);

    return isDeleted;
  }
}
