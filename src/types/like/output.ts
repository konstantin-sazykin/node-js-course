export enum LikesInfoEnum {
  None = 'None',
  Like = 'Like',
  Dislike = 'Dislike',
}

export interface LikeType {
  status: LikesInfoEnum;
  userId: string;
  commentId?: string;
  postId?: string;
  addedAt?: string;
}

export interface CommentLikeDataBaseOutputType {
  status: LikesInfoEnum;
  userId: string;
  commentId: string;
}

export interface PostLikeDataBaseOutputType {
  status: LikesInfoEnum;
  userId: string;
  postId: string;
  addedAt: string;
}

export interface NewestLikeInfoOutputType {
  addedAt: string;
  userId: string;
  login: string;
}

export interface LikesInfoOutputType {
  likesCount: number;
  dislikesCount: number;
  myStatus: LikesInfoEnum;
}

export interface ExtendedLikesInfoOutputType {
  likesCount: number;
  dislikesCount: number;
  myStatus: LikesInfoEnum;
  newestLikes: NewestLikeInfoOutputType[] | null;
}
