import { type WithId } from 'mongodb';

import { LikeModel } from '../../models/like.model';
import { CommentLikeDataBaseDto, PostLikeDataBaseDto } from '../../types/like/mapper';
import {
  type PostLikeDataBaseOutputType,
  type CommentLikeDataBaseOutputType,
} from '../../types/like/output';

export class LikeQueryRepository {
  async getLikesByCommentId(commentId: string): Promise<CommentLikeDataBaseDto[]> {
    const likes: CommentLikeDataBaseOutputType[] = await LikeModel.find({ commentId });

    return likes.map((like) => ({
      ...new CommentLikeDataBaseDto(like.commentId, like.status, like.userId),
    }));
  }

  async getLikesByPostId(postId: string): Promise<PostLikeDataBaseOutputType[]> {
    // @ts-expect-error
    const likes: Array<WithId<PostLikeDataBaseOutputType>> = await LikeModel.find({ postId }).sort({ addedAt: -1 });

    return likes.map((like) => ({
      ...new PostLikeDataBaseDto(like.postId, like.status, like.userId, like.addedAt),
    }));
  }
}
