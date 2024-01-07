import { type QuerySortDataType } from '../common';

export interface PostParams { id: string; }

export type QuerySortedPostsType = QuerySortDataType;

export interface CreatePostWithBlogIdInputModel {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
};

export interface CreatePostInputModel {
  title: string;
  shortDescription: string;
  content: string;
};

export interface UpdatePostInputModel {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
};

export interface CreatePostRepositoryInputModel {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
}
