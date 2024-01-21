import { type WithId } from 'mongodb';

import { type UserShortInfoDto } from '../user/mapper';

import { LikesInfoEnum, type LikesInfoOutputType } from '../like/output';

import { type CommentLikeDataBaseDto } from '../like/mapper';

import {
  type CommentType,
} from './output';

export class CommentOutputDto {
  id: string;
  content: string;
  commentatorInfo: {
    userId: string;
    userLogin: string;
  };

  createdAt: string;
  likesInfo: LikesInfoOutputType;

  constructor({
    id,
    content,
    createdAt,
    likes,
    currentUserId,
    user,
  }: CommentDataBaseDto & { user: UserShortInfoDto; currentUserId: string | null; likes: CommentLikeDataBaseDto[]; }) {
    this.id = id;
    this.content = content;
    this.commentatorInfo = {
      userId: user.userId,
      userLogin: user.login,
    };
    this.createdAt = createdAt.toISOString();

    const likesCount = likes.filter((i) => i.status === LikesInfoEnum.Like).length;
    const dislikesCount = likes.filter((i) => i.status === LikesInfoEnum.Dislike).length;
    const myStatus = likes.find((i) => i.userId === currentUserId)?.status ?? LikesInfoEnum.None;

    this.likesInfo = {
      likesCount,
      dislikesCount,
      myStatus,
    };
  }
}

export class CommentDataBaseDto {
  id: string;
  content: string;
  commentatorId: string;
  createdAt: Date;

  constructor({ _id, content, commentatorId, createdAt }: WithId<CommentType>) {
    this.id = _id.toString();
    this.content = content;
    this.createdAt = createdAt;
    this.commentatorId = commentatorId;
  }
}
