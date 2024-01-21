export enum LikesInfoEnum {
  None = 'None',
  Like = 'Like',
  Dislike = 'DisLike',
}

export interface LikeType {
  status: LikesInfoEnum;
  userId: string;
  commentId?: string;
  postId?: string;
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
}

export interface LikesInfoOutputType {
  likesCount: number;
  dislikesCount: number;
  myStatus: LikesInfoEnum;
}
