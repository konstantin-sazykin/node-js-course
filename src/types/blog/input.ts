export type BlogParams = { id: string };

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
