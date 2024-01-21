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

  async getLikesBuPostId(postId: string): Promise<PostLikeDataBaseOutputType[]> {
    const likes: PostLikeDataBaseDto[] = await LikeModel.find({ postId });

    return likes.map((like) => ({
      ...new PostLikeDataBaseDto(like.postId, like.status, like.userId),
    }));
  }
}
