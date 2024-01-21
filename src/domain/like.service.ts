import { type LikeRepository } from '../repositories/like/like.repository';
import { type LikesInfoEnum } from '../types/like/output';

export class LikeService {
  constructor(protected likeRepository: LikeRepository) {}

  async createOrUpdateLike(
    id: string,
    userId: string,
    status: LikesInfoEnum,
    type: 'comment' | 'post',
  ): Promise<boolean> {
    const result =
      type === 'comment'
        ? await this.likeRepository.addLikeForComment(id, userId, status)
        : await this.likeRepository.addLikeForPost(id, userId, status);

    return result;
  }
}
