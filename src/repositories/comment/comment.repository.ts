import { ObjectId } from 'mongodb';

import { commentCollection } from '../../db/db';
import { CommentDbMapper } from '../../types/comment/mapper';
import { type CommentRepositoryType } from '../../types/comment/output';

export class CommentRepository {
  async create(
    postId: string,
    commentatorId: string,
    content: string,
  ): Promise<CommentRepositoryType | null> {
    try {
      const result = await commentCollection.insertOne({
        commentatorId,
        postId,
        content,
        createdAt: new Date(),
      });

      const createdComment = await commentCollection.findOne({ _id: result.insertedId });

      if (!createdComment) {
        return null;
      }

      return { ...new CommentDbMapper(createdComment) };
    } catch (error) {
      console.error(error);

      return null;
    }
  }

  async update(id: string, content: string): Promise<boolean> {
    try {
      const result = await commentCollection.updateOne({ _id: new ObjectId(id) }, { $set: { content } });

      return !!result.modifiedCount;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async remove(id: string): Promise<boolean> {
    try {
      const result = await commentCollection.deleteOne({ _id: new ObjectId(id) });

      return !!result.deletedCount;
    } catch (error) {
      console.error(error);

      return false;
    }
  }
}
