import { commentCollection } from '../../db/db';
import { CommentDbMapper } from '../../types/comment/mapper';
import { CommentRepositoryType } from '../../types/comment/output';

export class CommentRepository {
  static async create(
    postId: string,
    commentatorId: string,
    content: string
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
}
