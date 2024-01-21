import { ObjectId } from 'mongodb';

import { PostDataBaseDto } from '../../types/post/mapper';
import { postCollection } from '../../db/db';
import { type CreatePostRepositoryInputModel, type UpdatePostInputModel } from '../../types/post/input';
import { type QueryPostOutputModel } from '../../types/post/output';

export class PostRepository {
  static async create(data: CreatePostRepositoryInputModel): Promise<QueryPostOutputModel | null> {
    try {
      const result = await postCollection.insertOne({
        createdAt: new Date().toISOString(),
        blogId: data.blogId,
        blogName: data.blogName,
        content: data.content,
        shortDescription: data.shortDescription,
        title: data.title,
      });

      if (result.acknowledged) {
        const createdPost = await postCollection.findOne({ _id: result.insertedId });

        if (createdPost) {
          return { ...new PostDataBaseDto(createdPost) };
        }
        return null;
      }

      return null;
    } catch (error) {
      console.error(error);

      return null;
    }
  }

  static async update(data: UpdatePostInputModel, id: string): Promise<boolean> {
    try {
      const result = await postCollection.updateOne(
        { _id: new ObjectId(id) },
        {
          $set: {
            blogId: data.blogId,
            content: data.content,
            title: data.title,
            shortDescription: data.shortDescription,
          },
        },
      );

      return !!result.modifiedCount;
    } catch (error) {
      console.error(error);

      return false;
    }
  }

  static async remove(id: string): Promise<boolean> {
    try {
      const result = await postCollection.deleteOne({ _id: new ObjectId(id) });

      return !!result.deletedCount;
    } catch (error) {
      console.error(error);

      return false;
    }
  }
}
