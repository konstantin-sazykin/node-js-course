import { LikeModel } from '../../models/like.model';
import { type LikesInfoEnum } from '../../types/like/output';

export class LikeRepository {
  async addLikeForComment(
    commentId: string,
    userId: string,
    status: LikesInfoEnum,
  ): Promise<boolean> {
    try {
      const updated = await LikeModel.findOneAndUpdate({ commentId, userId }, { status });

      if (!updated) {
        const created = await LikeModel.create({ commentId, userId, status });

        if (!created) {
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error(error);

      return false;
    }
  }

  async addLikeForPost(
    postId: string,
    userId: string,
    status: LikesInfoEnum,
  ): Promise<boolean> {
    try {
      const updated = await LikeModel.findOneAndUpdate({ postId, userId }, { status, addedAt: String((new Date()).getTime()) });

      if (!updated) {
        const created = await LikeModel.create({ postId, userId, status, addedAt: String((new Date()).getTime()) });

        if (!created) {
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error(error);

      return false;
    }
  }
}
