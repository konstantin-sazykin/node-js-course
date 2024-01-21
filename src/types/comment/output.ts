import { type LikesInfoOutputType } from '../like/output';

export interface CommentType {
  content: string;
  postId: string;
  commentatorId: string;
  createdAt: Date;
}

export interface CommentOutputType {
  id: string;
  content: string;
  commentatorInfo: {
    userId: string;
    userLogin: string;
  };
  createdAt: string;
  likesInfo: LikesInfoOutputType;
}
