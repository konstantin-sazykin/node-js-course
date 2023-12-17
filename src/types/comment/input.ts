import { QuerySortDataType } from '../common';

export type CommentsParams = { id: string };

export type QuerySortedCommentsType = QuerySortDataType;

export type CreateCommentType = {
  content: string;
}

export type UpdateCommentType = {
  content: string;
}