import { ObjectId } from 'mongodb';
import { PostMapper } from './../types/post/mapper';
import { postCollection } from '../db/db';
import { CreatePostInputModel, UpdatePostInputModel } from '../types/post/input';
import { QueryPostOutputModel } from '../types/post/output';

export class PostRepository {
  static async getAllPosts(): Promise<QueryPostOutputModel[]> {
    const posts = await postCollection.find({}).toArray();

    return posts.map((video) => ({ ...new PostMapper(video) }));
  }

  static async findPostsById(id: string): Promise<QueryPostOutputModel | null> {
    try {
      const post = await postCollection.findOne({ _id: new ObjectId(id) });

      if (!post) {
        return null;
      }

      return {
        ...new PostMapper(post),
      };
    } catch (error) {
      console.log(error);

      return null;
    }
  }

  static async createPost(data: CreatePostInputModel): Promise<QueryPostOutputModel | null> {
    try {
      const result = await postCollection.insertOne({
        ...data,
        createdAt: new Date().toISOString(),
        isMembership: false,
      });

      if (result.acknowledged) {
        const createdPost = await postCollection.findOne({ _id: result.insertedId });

        if (createdPost) {
          return { ...new PostMapper(createdPost) };
        } else {
          return null;
        }
      }

      return null;
    } catch (error) {
      console.log(error);

      return null;
    }
  }

  static async updatePost(data: UpdatePostInputModel, id: string): Promise<boolean> {
    try {
      const result = await postCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { ...data } }
      );

      return !!result.modifiedCount;
    } catch (error) {
      console.log(error);

      return false;
    }
  }

  static async deletePost(id: string): Promise<boolean> {
    try {
      const result = await postCollection.deleteOne({ _id: new ObjectId(id) });

      return !!result.deletedCount;
    } catch (error) {
      console.log(error);

      return false;
    }
  }
}
