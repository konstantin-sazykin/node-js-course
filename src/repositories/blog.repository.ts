import { db } from '../db/db';
import { CreateBlogInputModel, UpdateBlogInputModel } from '../types/blog/input';
import { BlogType } from '../types/blog/output';

export class BlogsRepository {
  static getAllBlogs() {
    return db.blogs;
  }

  static getBlogById(id: string) {
    return db.blogs.find((blog) => blog.id === id) || null;
  }

  static createBlog(data: CreateBlogInputModel) {
    try {
      const newBlog: BlogType = {
        id: String(new Date().getTime()),
        description: data.description,
        name: data.name,
        websiteUrl: data.websiteUrl,
      };

      db.blogs.push(newBlog);

      return newBlog;
    } catch (error) {
      return null;
    }
  }

  static updateBlog(id: string, data: UpdateBlogInputModel) {
    try {
      const updatedBlogIndex = db.blogs.findIndex((blog) => blog.id === id);

      if (updatedBlogIndex === -1) {
        return false;
      }

      db.blogs[updatedBlogIndex] = {
        ...db.blogs[updatedBlogIndex],
        ...data
      };

      return true;
    } catch (error) {
      return false;
    }
  }

  static deleteBlog(id: string) {
    try {
      const deletedBlogIndex = db.blogs.findIndex((blog) => blog.id === id);

      if (deletedBlogIndex === -1) {
        return false;
      }

      db.blogs = db.blogs.filter((blog) => blog.id !== id);

      return true;
    } catch (error) {
      return false;
    }
  }
}
