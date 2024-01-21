import { PostRepository } from '../repositories/post/post.repository';
import { type CreatePostWithBlogIdInputModel, type UpdatePostInputModel } from '../types/post/input';
import { type QueryPostOutputModel } from '../types/post/output';
import { type BlogQueryRepository } from '../repositories/blog/blog.query-repository';

import { type CreatePostInputModel } from './../types/post/input';

export class PostService {
  constructor(protected blogQueryRepository: BlogQueryRepository) {}
  async createPost(data: CreatePostWithBlogIdInputModel): Promise<QueryPostOutputModel | null> {
    const relatedBlog = await this.blogQueryRepository.getBlogById(data.blogId);

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

  async createPostByBlogId(blogId: string, data: CreatePostInputModel): Promise<QueryPostOutputModel | null> {
    const relatedBlog = await this.blogQueryRepository.getBlogById(blogId);

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

  async updatePost(id: string, data: UpdatePostInputModel): Promise<boolean> {
    const isUpdated = await PostRepository.update(data, id);

    return isUpdated;
  }

  async deletePostById(id: string): Promise<boolean> {
    const isDeleted = await PostRepository.remove(id);

    return isDeleted;
  }
}
