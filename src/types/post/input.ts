import { QuerySortDataType } from "../common";

export type PostParams = { id: string };

export type QuerySortedPostsType = QuerySortDataType;

export type CreatePostWithBlogIdInputModel = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
}

export type CreatePostInputModel = {
  title: string;
  shortDescription: string;
  content: string;
}

export type UpdatePostInputModel = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
}

export type CreatePostRepositoryInputModel = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
}