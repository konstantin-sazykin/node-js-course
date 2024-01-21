import { type LikesInfoEnum } from './output';

export class CommentLikeDataBaseDto {
  constructor(
    public commentId: string,
    public status: LikesInfoEnum,
    public userId: string,
  ) {}
}

export class PostLikeDataBaseDto {
  constructor(
    public postId: string,
    public status: LikesInfoEnum,
    public userId: string,
  ) {}
}
