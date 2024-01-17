export enum LikesInfoEnum {
  None = 'None',
  Like = 'Like',
  Dislike = 'DisLike',
}

export interface LikesInfoType {
  status: LikesInfoEnum;
  userId: string;
}
export interface CommentType {
  content: string;
  postId: string;
  commentatorId: string;
  createdAt: Date;
  likes: LikesInfoType[];
};

export interface LikesInfoOutputType {
  likesCount: number;
  dislikesCount: number;
  myStatus: LikesInfoEnum;
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
