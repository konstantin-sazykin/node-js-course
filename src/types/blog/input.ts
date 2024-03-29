import { type QuerySortDataType } from '../common';

export interface BlogParams { id: string; }

export type QuerySortedBlogsType = QuerySortDataType & {
  searchNameTerm?: string;
};

export interface CreateBlogInputModel {
  name: string;
  description: string;
  websiteUrl: string;
}

export interface UpdateBlogInputModel {
  name: string;
  description: string;
  websiteUrl: string;
}
