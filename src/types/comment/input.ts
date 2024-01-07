import { type QuerySortDataType } from '../common';

export interface CommentsParams { id: string; }

export type QuerySortedCommentsType = QuerySortDataType;

export interface CreateCommentType {
  content: string;
};

export interface UpdateCommentType {
  content: string;
}
