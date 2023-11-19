export interface BlogType {
  id: string
  name: string
  description: string
  websiteUrl: string
}

export type QueryBlogDTO = {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
}

export class QueryBlog implements QueryBlogDTO {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;

  constructor({ id, name, description, websiteUrl}: QueryBlogDTO) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.websiteUrl = websiteUrl;
  }
}