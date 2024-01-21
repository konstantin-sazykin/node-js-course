import { PostRepository } from '../repositories/post/post.repository';
import { type CreatePostWithBlogIdInputModel, type UpdatePostInputModel } from '../types/post/input';
import { type QueryPostOutputModel } from '../types/post/output';
import { BlogQueryRepository } from '../repositories/blog/blog.query-repository';

import { type CreatePostInputModel } from './../types/post/input';

export class PostService {
  static async createPost(data: CreatePostWithBlogIdInputModel): Promise<QueryPostOutputModel | null> {
    const relatedBlog = await BlogQueryRepository.getBlogById(data.blogId);

    if (!relatedBlog) {
      return null;
    }

    const createdBlog = await PostRepository.create({
      blogId: data.blogId,
      blogName: relatedBlog.name,
      content: data.content,
      shortDescription: data.shortDescription,
      title: data.title,
    });

    return createdBlog;
  }

  static async createPostByBlogId(blogId: string, data: CreatePostInputModel): Promise<QueryPostOutputModel | null> {
    const relatedBlog = await BlogQueryRepository.getBlogById(blogId);

    if (!relatedBlog) {
      return null;
    }

    const createdPost = await PostRepository.create({
      blogId,
      blogName: relatedBlog.name,
      content: data.content,
      shortDescription: data.shortDescription,
      title: data.title,
    });

    return createdPost;
  }

  static async updatePost(id: string, data: UpdatePostInputModel): Promise<boolean> {
    const isUpdated = await PostRepository.update(data, id);

    return isUpdated;
  }

  static async deletePostById(id: string): Promise<boolean> {
    const isDeleted = await PostRepository.remove(id);

    return isDeleted;
  }
}
