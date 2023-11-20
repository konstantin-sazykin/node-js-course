import { QueryBlogOutputModel } from "@/types/blog/output";

export class QueryBlogDTO implements QueryBlogOutputModel {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;

  constructor({ id, name, description, websiteUrl}: QueryBlogOutputModel) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.websiteUrl = websiteUrl;
  }
}
