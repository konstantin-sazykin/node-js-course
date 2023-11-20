import { db } from 'src/db/db';
import { CreatePostInputModel, UpdatePostInputModel } from 'src/types/post/input';
import { PostType } from 'src/types/post/output';
import { createUuid } from 'src/utils/uuid';

export class PostRepository {
  static getAllPosts() {
    return db.posts;
  }

  static findPostsById(id: string) {
    return db.posts.find((post) => post.id === id) || null;
  }

  static createPost(data: CreatePostInputModel) {
    const belongsToBlog = db.blogs.find((blog) => blog.id === data.blogId);

    if (!belongsToBlog) {
      return null;
    }

    const newPost: PostType = {
      id: createUuid(),
      title: data.title,
      shortDescription: data.shortDescription,
      content: data.content,
      blogId: belongsToBlog.id,
      blogName: belongsToBlog.name,
    };

    db.posts.push(newPost);

    return newPost;
  }

  static updatePost(data: UpdatePostInputModel, id: string) {
    const belongsToBlog = db.blogs.find((blog) => blog.id === data.blogId);

    if (!belongsToBlog) {
      return null;
    }

    const updatedPostIndex = db.posts.findIndex(post => post.id === id);

    if (updatedPostIndex === -1) {
      return null;
    }

    db.posts[updatedPostIndex] = {
      ...db.posts[updatedPostIndex],
      ...data
    }

    return true;
  }

  static deletePost(id: string) {
    const deletedPostIndex = db.posts.findIndex(post => post.id === id);

    if (deletedPostIndex === -1) {
      return null;
    }

    db.posts = db.posts.filter(post => post.id !== id);

    return true;
  }
}
