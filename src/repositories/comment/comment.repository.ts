import { ObjectId } from 'mongodb';

import { CommentDataBaseDto } from '../../types/comment/mapper';
import { CommentModel } from '../../models/comment.model';

export class CommentRepository {
  async create(
    postId: string,
    commentatorId: string,
    content: string,
  ): Promise<CommentDataBaseDto | null> {
    try {
      const createdComment = await CommentModel.create({
        commentatorId,
        postId,
        content,
        createdAt: new Date(),
        likes: [],
      });

      return { ...new CommentDataBaseDto(createdComment) };
    } catch (error) {
      console.error(error);

      return null;
    }
  }

  async update(id: string, content: string): Promise<boolean> {
    try {
      const result = await CommentModel.updateOne({ _id: new ObjectId(id) }, { content });

      return !!result.modifiedCount;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async remove(id: string): Promise<boolean> {
    try {
      const result = await CommentModel.deleteOne({ _id: new ObjectId(id) });

      return !!result.deletedCount;
    } catch (error) {
      console.error(error);

      return false;
    }
  }
}
