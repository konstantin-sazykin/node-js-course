import { type QuerySortDataType } from '../common';
import { type LikesInfoEnum } from '../like/output';

export interface CommentsParams { id: string; }

export type QuerySortedCommentsType = QuerySortDataType;

export interface CreateCommentType {
  content: string;
};

export interface UpdateCommentType {
  content: string;
}

export interface UpdateLikeInfoType {
  likeStatus: LikesInfoEnum;
}
