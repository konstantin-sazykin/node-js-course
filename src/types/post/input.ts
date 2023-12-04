import { QuerySortDataType } from "../common";

export type PostParams = { id: string };

export type QuerySortedPostsType = QuerySortDataType;

export type CreatePostInputModel = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
}

export type UpdatePostInputModel = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
}